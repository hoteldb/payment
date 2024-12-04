const express = require('express');
const cors = require('cors');
const app = express(); // app 초기화

const hotelRoutes = require('./routes/hotel'); // hotel.js 라우터 가져오기
const paymentRoutes = require('./routes/payment'); // payment.js 라우터 가져오기


app.use(cors());
app.use(express.json());

// /api/hotel 경로로 hotel.js 연결
app.use('/api/hotel', hotelRoutes);

// /api/payment 경로로 payment.js 연결
app.use('/api/payment', paymentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
