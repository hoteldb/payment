import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HotelInfo from './HotelInfo/HotelInfo';
import Payment from './Payment/Payment';

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 경로를 특정 호텔 ID로 리디렉션 */}
        <Route path="/" element={<Navigate to="/hotel/1" />} />
        
        {/* 특정 호텔 정보 */}
        <Route path="/hotel/:hotelId" element={<HotelInfo />} />

        {/* 결제 페이지 */}
        <Route path="/payment" element={<Payment />} />
        </Routes>
    </Router>
  );
}

export default App;
