import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Payment() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId'); // URL에서 roomId 가져오기
  const userId = 1; // 로그인된 사용자 ID

  const [paymentData, setPaymentData] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null); // 선택된 쿠폰
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // 선택된 결제 수단
  const [selectedDate, setSelectedDate] = useState({ checkIn: '', checkOut: '' }); // 예약 일정
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('현재 URL:', window.location.href); // 현재 URL 출력
    console.log('프론트엔드 roomId:', roomId); // roomId 값 확인

    if (!roomId) {
      console.error('roomId가 전달되지 않았습니다.');
      setError('roomId가 유효하지 않습니다.');
      return; // API 호출 중단
    }

    fetch(`http://localhost:5000/api/payment/payment-details?roomId=${roomId}&userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP 에러 상태: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Payment API 응답 데이터:', JSON.stringify(data, null, 2));
        setPaymentData(data);
      })
      .catch((err) => {
        console.error('Payment API 요청 에러:', err.message);
        setError(err.message);
      });
  }, [roomId]);

  if (!paymentData && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>에러 발생: {error}</div>;
  }

  const { room, user, coupons, paymentMethods } = paymentData;

  if (!room) {
    return <div>객실 정보를 불러오는 데 실패했습니다.</div>;
  }

  // 선택된 쿠폰의 할인율 가져오기
  const discountRate = selectedCoupon ? parseFloat(selectedCoupon.discount_rate) : 0;

  // 숙박일수 계산
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate - checkInDate;
    return timeDiff > 0 ? timeDiff / (1000 * 60 * 60 * 24) : 0; // 밀리초를 일수로 변환
  };

  const nights = calculateNights(selectedDate.checkIn, selectedDate.checkOut);

  // 총 객실 가격 계산 (숙박일수에 따라)
  const totalRoomPrice = nights * room.price;

  // 할인 금액 계산
  const discountAmount = totalRoomPrice * (discountRate / 100);

  // 최종 결제 금액 계산
  const discountedPrice = totalRoomPrice - discountAmount;

  // 공통 스타일
  const boxStyle = {
    border: '1px solid #ddd',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', padding: '20px', gap: '20px' }}>
      {/* 예약자 정보, 쿠폰 선택, 결제 수단 선택 */}
      <div style={{ flex: 2 }}>
        <h2>예약 확인 및 결제</h2>

        {/* 예약자 정보 */}
        <div style={{ marginBottom: '30px' }}>
          <h3>예약자 정보</h3>
          <p><strong>이름:</strong> {user?.name || 'N/A'}</p>
          <p><strong>이메일:</strong> {user?.email || 'N/A'}</p>
        </div>

        <hr style={{ border: '1px solid #ddd', margin: '30px 0' }} />

        {/* 쿠폰 선택 */}
        <div style={{ marginBottom: '30px' }}>
          <h3>쿠폰 선택</h3>
          <select
            style={{ width: '100%', padding: '10px' }}
            onChange={(e) => {
              const selected = coupons.find((coupon) => coupon.code === e.target.value);
              setSelectedCoupon(selected);
            }}
          >
            <option value="">쿠폰을 선택하세요</option>
            {coupons.map((coupon, index) => (
              <option key={index} value={coupon.code}>
                {coupon.code} ({coupon.discount_rate}%)
              </option>
            ))}
          </select>
        </div>

        <hr style={{ border: '1px solid #ddd', margin: '30px 0' }} />

        {/* 결제 수단 선택 */}
        <div style={{ marginBottom: '30px' }}>
          <h3>결제 수단</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                style={{
                  display: 'inline-block',
                  padding: '15px 20px',
                  textAlign: 'center',
                  borderRadius: '10px',
                  border: `2px solid ${selectedPaymentMethod === method.id ? '#007BFF' : '#ddd'}`,
                  backgroundColor: selectedPaymentMethod === method.id ? '#E6F0FF' : '#fff',
                  color: selectedPaymentMethod === method.id ? '#007BFF' : '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                {method.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 예약 호텔 정보 및 최종 결제 금액 */}
      <div style={{ flex: 1 }}>
        {/* 예약 호텔 정보 */}
        <div style={boxStyle}>
          <h3>{room.hotelName}</h3>
          <img
            src={room.hotelImage}
            alt="호텔 이미지"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }}
          />
          <p><strong>객실 이름:</strong> {room.name}</p>
          {/* 예약 일정 선택 */}
          <div style={{ marginTop: '20px' }}>
            <h3>예약 일정</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>
                <strong>체크인 날짜:</strong>
                <input
                  type="date"
                  style={{ padding: '10px', width: '100%', marginTop: '5px' }}
                  value={selectedDate.checkIn}
                  onChange={(e) =>
                    setSelectedDate((prev) => ({ ...prev, checkIn: e.target.value }))
                  }
                />
              </label>
            </div>
            <div>
              <label>
                <strong>체크아웃 날짜:</strong>
                <input
                  type="date"
                  style={{ padding: '10px', width: '100%', marginTop: '5px' }}
                  value={selectedDate.checkOut}
                  onChange={(e) =>
                    setSelectedDate((prev) => ({ ...prev, checkOut: e.target.value }))
                  }
                />
              </label>
            </div>
          </div>
        </div>

        {/* 최종 결제 금액 */}
        <div style={boxStyle}>
          <h3>결제 정보</h3>
          <p><strong>숙박일수:</strong> {nights}박</p>
          <p><strong>기존 가격:</strong> {totalRoomPrice.toFixed(2)}원</p>
          <p><strong>할인:</strong> {discountAmount.toFixed(2)}원</p>
          <p style={{ fontSize: '20px', color: 'red', fontWeight: 'bold' }}>
            최종 결제 금액: {discountedPrice.toFixed(2)}원
          </p>
        </div>

        <button
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
          onClick={() => {
            if (!selectedDate.checkIn || !selectedDate.checkOut || nights <= 0) {
              alert('체크인과 체크아웃 날짜를 올바르게 선택해주세요!');
            } else {
              alert('결제가 완료되었습니다!');
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

export default Payment;
