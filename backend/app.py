from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
from math import radians, cos, sin, asin, sqrt
import random

# .env
load_dotenv()
API_KEY = os.getenv("API_KEY")

# 지원하는 카테고리
VALID_CATEGORIES = ["restaurant", "cafe"]

# 자료 구조 클래스
class Node:
    def __init__(self, id_, name, lat, lng, category, place_id, address):
        self.id = id_
        self.name = name
        self.lat = lat
        self.lng = lng
        self.category = category
        self.place_id = place_id
        self.address = address
        self.edges = []

class PlaceGraph:
    def __init__(self):
        self.nodes = []

    def add_place(self, node):
        self.nodes.append(node)

    def connect_all_by_distance(self, max_distance_m=500):
        for i, n1 in enumerate(self.nodes):
            for j, n2 in enumerate(self.nodes):
                if i == j:
                    continue
                if self.haversine(n1, n2) <= max_distance_m:
                    n1.edges.append(n2)

    def haversine(self, n1, n2):
        lon1, lat1, lon2, lat2 = map(radians, [n1.lng, n1.lat, n2.lng, n2.lat])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        km = 6367 * c
        return km * 1000  # m 단위

    def nearest_by_category(self, lat, lng, category):
        target = Node(-1, "user", lat, lng, "", "", "")
        nodes = [n for n in self.nodes if n.category == category]
        nodes.sort(key=lambda n: self.haversine(n, target))
        return nodes

# 선형 구조: 최근 추천 Stack/Queue
class Stack:
    def __init__(self):
        self._s = []
    def push(self, val):
        self._s.append(val)
    def pop(self):
        return self._s.pop() if self._s else None

class Queue:
    def __init__(self):
        self._q = []
    def enqueue(self, val):
        self._q.append(val)
    def dequeue(self):
        return self._q.pop(0) if self._q else None

# FastAPI 세팅
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = PlaceGraph()
recent_places = Queue()

@app.get("/places/{category}")
def get_places(category: str, lat: float = Query(None), lng: float = Query(None)):
    if category not in VALID_CATEGORIES:
        return {"error": "지원하지 않는 카테고리입니다."}

    if lat is None or lng is None:
        lat, lng = 37.337, 127.268  # 기본 위치

    location_str = f"{lat},{lng}"
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": location_str,
        "radius": 5000,
        "language": "ko",
        "key": API_KEY,
        "type": category
    }
    res = requests.get(url, params=params)
    data = res.json()
    results = data.get("results", [])

    if not results:
        return [{"name": "해당 범위 내 장소 없음", "address": "", "link": "", "lat": 0, "lng": 0}]

    # Node 생성 + Graph 추가
    graph.nodes = []
    for i, p in enumerate(results):
        n = Node(
            id_=i,
            name=p["name"],
            lat=p["geometry"]["location"]["lat"],
            lng=p["geometry"]["location"]["lng"],
            category=category,
            place_id=p["place_id"],
            address=p.get("vicinity", "주소 정보 없음")
        )
        graph.add_place(n)

    graph.connect_all_by_distance(max_distance_m=800)
    nearest = graph.nearest_by_category(lat, lng, category)

    # 최근 추천과 중복되지 않도록 필터링
    recent_ids = [n.id for n in recent_places._q]
    available = [n for n in nearest if n.id not in recent_ids]
    if not available:
        available = nearest

    random.shuffle(available)
    nearest5 = available[:5]

    # Queue에 최근 추천 추가
    for n in nearest5:
        recent_places.enqueue(n)
        if len(recent_places._q) > 10:
            recent_places.dequeue()

    return [
        {
            "name": n.name,
            "address": n.address,
            "link": f"https://www.google.com/maps/place/?q=place_id:{n.place_id}",
            "lat": n.lat,
            "lng": n.lng
        } for n in nearest5
    ]
