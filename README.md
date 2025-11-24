# Data Structure Project: 사용자 위치 기반 가맹점 추천 서비스

## 1. 프로젝트 개요
**사용자 위치 기반 가맹점 추천 서비스**  
- 사용자가 주변 식당, 카페, 노래방을 선택하고 추천받을 수 있는 웹 서비스  
- Google Maps API를 활용하여 위치 기반 추천 제공  
- React + FastAPI 기반으로 구현  
- 최근 추천 중복 방지 및 추천 장소 거리 계산 기능 포함  

---

## 2. 프로젝트 특징
- **실생활 연관성**: 실제 위치 기반 추천 시스템으로 사용자가 주변 가맹점을 쉽게 탐색 가능  
- **자료 구조 활용**  
  - **선형 구조**: `Queue`로 최근 추천 장소 10개까지 관리하여 중복 최소화  
  - **비선형 구조**: `Graph`로 추천 장소 간 근접 관계 표현, `Node` 클래스 활용  
- **클래스 기반 설계**: `Node`, `PlaceGraph`, `Stack`, `Queue` 클래스 사용  
- **중간 난이도 구현**: API 연동, 거리 계산, 중복 방지 로직 등 실용적 알고리즘 적용  

---

## 3. 프로젝트 구조

```text
DSproject/
├── backend/               # FastAPI 서버
│   ├── app.py             # API 서버 메인 코드
│   ├── venv/              # 가상환경 (업로드 제외)
│   └── .env               # FastAPI용 API Key
├── frontend/              # React 프론트엔드 (Vite 기반)
│   ├── src/
│   │   └── App.jsx
│   ├── node_modules/      # 설치 패키지 (업로드 제외)
│   └── .env               # React용 Google Maps API Key
├── .gitignore
└── README.mds
```

---

## 4. 실행 방법

### ① 백엔드 서버 (FastAPI)

```text
1. `backend` 폴더로 이동
cd DSproject/backend

2. 가상환경 활성화
# Mac/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate

3. 필요한 패키지 설치
pip install -r requirements.txt

4. 서버 실행
uvicorn app:app --reload
```

- 기본 주소: http://127.0.0.1:8000
- Swagger UI 확인: http://127.0.0.1:8000/docs


### ② 프론트엔드 서버 (React + Vite)

```text
1. frontend 폴더로 이동
cd DSproject/frontend

2. 필요한 패키지 설치
npm install

3. 서버 실행
npm run dev
```

- 기본 주소: http://localhost:5173/

---

## 5. 사용 방법
1. 브라우저에서 http://localhost:5173/ 접속
2. 식당, 카페, 노래방 버튼 중 원하는 카테고리 선택
3. 추천받기 클릭 → 추천 장소 목록 표시
4. 📍 내 위치 가져오기 클릭 → 지도에 내 위치 표시
5. 지도 위에 추천 장소 마커 확인 가능
6. 추천 목록에는 최근 추천과 중복되지 않는 장소가 우선 표시

---

## 6. 기술 스택
- 백엔드: Python, FastAPI, Requests, CORS Middleware
- 프론트엔드: React, Vite, Google Maps JavaScript API, @react-google-maps/api
- 데이터: Google Places API 활용, JSON 데이터 처리

---

## 7. 주요 자료 구조
- 선형 구조: Queue, Stack(최근 추천 장소 관리, 중복 방지)
- 비선형 구조: Graph, Node(추천 장소 간 거리 기반 연결, 근접 관계 표현)