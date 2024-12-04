import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function HotelInfo() {
  const { hotelId } = useParams(); // URL에서 hotelId 가져오기
  const userId = 1; // 로그인된 사용자 ID 
  const [hotelData, setHotelData] = useState(null); // 호텔 데이터 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/hotel/hotel-details?hotelId=${hotelId}&userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP 에러 상태: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('API 응답 데이터:', data); // hotelData 확인
        setHotelData(data); // 데이터 저장
      })
      .catch((err) => {
        console.error('API 요청 에러:', err.message);
        setError(err.message);
      });
  }, [hotelId]);
  
  // 객실 데이터 출력
  if (hotelData) {
    console.log('roomDetails:', hotelData.roomDetails); // roomDetails 내용 확인
  }
  

  // 데이터 로딩 중
  if (!hotelData && !error) {
    return <div>Loading...</div>;
  }

  // 데이터 로드 실패
  if (error) {
    return <div>에러 발생: {error}</div>;
  }

  // 데이터 로드 성공
  const { hotel, hotelImages, roomDetails, reviews, events } = hotelData;

  const facilities = [
    hotel.gym && '헬스장',
    hotel.spa && '스파',
    hotel.pool && '수영장',
    hotel.jazz_bar && '재즈바',
    hotel.business_lounge && '업무 공간 제공',
    hotel.sky_lounge && '스카이라운지',
    hotel.rooftop && '루프탑',
    hotel.boufet && '뷔페',
    hotel.no_smoking && '금연구역',
    hotel.terrace && '테라스',
  ].filter(Boolean);

  // 리뷰 내용 20자 제한 처리 함수
  const truncateReview = (review) => {
    return review.length > 20 ? `${review.slice(0, 20)}...` : review;
  };

  // 공통 스타일
  const boxStyle = {
    padding: '15px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    marginBottom: '15px',
    flex: 1, // 동일한 크기로 설정
    minWidth: '200px', // 최소 너비 설정
  };

  const lightBlueBoxStyle = {
    ...boxStyle,
    backgroundColor: '#F0F8FF', // 연한 하늘색
  };

  const rowContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* 호텔 및 객실 사진 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {/* 호텔 사진 */}
        <img
          src={hotelImages[0]?.hotel_image_url || 'placeholder.jpg'}
          alt="Hotel Front"
          style={{ width: '50%', objectFit: 'cover', borderRadius: '8px' }}
        />

        {/* 객실 사진 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '50%' }}>
          {roomDetails.slice(0, 2).map((room, index) => (
            <img
              key={index}
              src={room.room_image_url}
              alt={`Room ${index + 1}`}
              style={{ width: '100%', height: '50%', objectFit: 'cover', borderRadius: '8px' }}
            />
          ))}
        </div>
      </div>

      {/* 호텔 정보 */}
      <h1>{hotel.hotel_name}</h1>
      <p style={{ textAlign: 'right', fontSize: '18px' }}>
        <strong>1박 가격:</strong> {hotel.price_range}
      </p>

      {/* 평점, 부대시설, 위치 (가로 정렬) */}
      <div style={rowContainerStyle}>
        {/* 평점 및 리뷰 */}
        <div style={boxStyle}>
          <h3>평점 및 리뷰</h3>
          <p>⭐ {hotel.rating_avg} / 5</p>
          <ul>
            {reviews.slice(0, 2).map((review, index) => (
              <li key={index}>{truncateReview(review.comments)} </li>
            ))}
          </ul>
        </div>

        {/* 부대시설 */}
        <div style={boxStyle}>
          <h3>부대시설</h3>
          <ul>
            {facilities.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
          </ul>
        </div>

        {/* 위치 */}
        <div style={boxStyle}>
          <h3>위치</h3>
          <p>
            {hotel.city_name}, {hotel.country_name}
          </p>
        </div>
      </div>

      {/* 객실 선택 및 호텔 행사 */}
      <div style={rowContainerStyle}>
        {/* 객실 선택 */}
        <div style={{ flex: 2 }}>
          <h3>객실 선택</h3>
          {roomDetails.map((room, index) => (
            <div key={index} style={lightBlueBoxStyle}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={room.room_image_url}
                  alt={room.room_name}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    marginRight: '10px',
                    borderRadius: '8px',
                  }}
                />
                <div>
                  <p><strong>{room.room_name}</strong></p>
                  <p>{room.room_price}원</p>
                  <button
                    style={{
                      marginTop: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    key={room.room_id}
                    onClick={() => {
                      console.log('결제하기 버튼 클릭 - room:', room); // 디버깅 로그
                      navigate(`/payment?roomId=${room.room_id}`);
                    }}
                  >
                    결제하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 호텔 행사 */}
        <div style={{ flex: 1 }}>
          <h3>숙소 행사</h3>
          <div style={boxStyle}>
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  <p>
                    <strong>{event.event_name}</strong>: {event.event_description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelInfo;
