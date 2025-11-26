# Data Structure Project: 사용자 위치 기반 가맹점 추천 서비스

## 1. 프로젝트 개요
**사용자 위치 기반 가맹점 추천 서비스**  
- 대학생이 주변 식당·카페를 찾을 때 겪는 시간·선택 고민을 해결
- 현재 위치 기반으로 주변 장소 5곳을 랜덤 추천하고, 지도 링크로 바로 이동 가능
- 사용자가 주변 식당, 카페 카테고리를 선택하고 추천받을 수 있는 웹 서비스  
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
└── README.md
```

---

## 4. 알고리즘
사용자 위치(lat, lng)와 카테고리(category)를 입력받아서

→ Google Places API에서 장소를 가져오고

→ 그래프 형태로 구조화한 뒤

→ 사용자와 가까운 장소들을 정렬하고

→ 최근 추천과 중복되지 않는 결과를 랜덤으로 뽑아

→ 최종 추천 리스트를 반환

---

## 5. 실행 방법

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

## 6. 사용 방법
1. 브라우저에서 http://localhost:5173/ 접속
2. 식당, 카페 중 원하는 카테고리 선택
3. 추천받기 클릭 → 추천 장소 목록 표시
4. 📍 내 위치 가져오기 클릭 → 지도에 내 위치 표시
5. 지도 위에 추천 장소 마커 확인 가능
6. 추천 목록에는 최근 추천과 중복되지 않는 장소가 우선 표시

---

## 7. 기술 스택
- 백엔드: Python, FastAPI, Requests, CORS Middleware
- 프론트엔드: React, Vite, Google Maps JavaScript API, @react-google-maps/api
- 데이터: Google Places API 활용, JSON 데이터 처리

---

## 8. 주요 자료 구조
- 선형 구조: Queue, Stack(최근 추천 장소 관리, 중복 방지)
- 비선형 구조: Graph, Node(추천 장소 간 거리 기반 연결, 근접 관계 표현)

---

## 9. 향후 개선 사항
1. 중복 추천 로직 개선 및 데이터 구조 안정화
- Node의 `id`를 단순 index가 아닌 Google `place_id` 기반으로 전환해 정확한 중복 제거 가능
- 사용자별 최근 추천 정보를 저장할 수 있도록 구조 확장(예: user_id 기반 Queue 관리)

2. 장소 데이터 캐싱 및 그래프 구조 최적화
- 매 요청마다 그래프를 재생성하는 구조를 개선하여 불필요한 연산 감소
- 특정 위치(lat, lng)에 대한 장소 검색 결과를 캐싱하여 API 호출 횟수와 응답 속도를 크게 최적화
- Graph 연결 및 거리 계산 로직에서 지구 반지름, 간선 연결 범위 등 알고리즘 정확성 향상