// React 훅과 Google Maps 관련 컴포넌트 불러오기
import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// 지도 컨테이너 스타일
const containerStyle = { width: "100%", height: "400px" };
// 지도 초기 중심 위치 (한국외국어대학교 글로벌캠퍼스)
const defaultCenter = { lat: 37.337, lng: 127.268 };

// --------------------------------------------
// 거리 계산 함수 (Haversine formula 사용)
// --------------------------------------------
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  // Haversine 공식
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// --------------------------------------------
// App 컴포넌트
// --------------------------------------------
function App() {
  // 상태 관리
  const [category, setCategory] = useState("restaurant");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // Google Maps API 로딩
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  // --------------------------------------------
  // 추천 장소 가져오기 함수
  // --------------------------------------------
  const fetchPlaces = async () => {
    if (!userLocation) {
      alert("내 위치를 먼저 가져와 주세요.");
      return;
    }
    setLoading(true);   // 로딩 시작
    setError("");   // 기존 에러 초기화
    try {
      // 백엔드 FastAPI 호출
      const res = await fetch(
        `http://127.0.0.1:8000/places/${category}?lat=${userLocation.lat}&lng=${userLocation.lng}`
      );
      if (!res.ok) throw new Error("서버 에러");   // HTTP 에러 처리
      const data = await res.json();   // JSON 파싱
      setPlaces(data);   // 장소 상태 업데이트
    } catch (e) {
      setError(e.message);   // 에러 상태 업데이트
    } finally {
      setLoading(false);   // 로딩 종료
    }
  };

  // --------------------------------------------
  // 사용자 현재 위치 가져오기
  // --------------------------------------------
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => alert("위치 정보를 가져오지 못했습니다.")
      );
    } else {
      alert("브라우저에서 위치 정보를 지원하지 않습니다.");
    }
  };

  // --------------------------------------------
  // 렌더링
  // --------------------------------------------
  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1>위치 기반 가맹점 추천 서비스</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setCategory("restaurant")}>🍽 식당</button>
        <button onClick={() => setCategory("cafe")}>☕ 카페</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={fetchPlaces} disabled={loading}>
          {loading ? "불러오는 중..." : "추천받기"}
        </button>
        <button onClick={getUserLocation}>📍 내 위치 가져오기</button>
      </div>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      <ul>
        {places.map((p, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <b>{p.name}</b> <br />
            {p.address} <br />
            {userLocation && (
              <span>
                📍 거리: {getDistance(
                  userLocation.lat,
                  userLocation.lng,
                  p.lat,
                  p.lng
                ).toFixed(2)} km
              </span>
            )}
            <br />
            <a href={p.link} target="_blank">지도에서 보기</a>
          </li>
        ))}
      </ul>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}
          zoom={15}
        >
          {places.map((p, i) => (
            <Marker key={i} position={{ lat: p.lat, lng: p.lng }} title={p.name} />
          ))}
          {userLocation && <Marker position={userLocation} title="내 위치" />}
        </GoogleMap>
      )}
    </div>
  );
}

// App 컴포넌트 export
export default App;
