const express = require('express');
const router = express.Router(); // Router 객체 생성
const db = require('../models/db'); // DB 연결 파일



router.get('/payment-details', async (req, res) => {
    const { roomId, userId } = req.query; // 클라이언트에서 전달된 roomId와 userId 추출
  
    // 디버깅 로그 추가
    console.log('API 요청된 roomId:', roomId);
    console.log('API 요청된 userId:', userId);
  
    if (!roomId || !userId) {
      return res.status(400).json({ error: 'roomId와 userId가 필요합니다.' });
    }
  
    try {
      // 로직 처리
      const [roomDetails] = await db.promise().query(
        `SELECT rt.room_name AS name, rt.room_price AS price, h.hotel_name AS hotelName,
                (SELECT hotel_image_url FROM hotel_image WHERE hotel_id = h.hotel_id LIMIT 1) AS hotelImage
         FROM room r
         JOIN room_type rt ON r.room_type_id = rt.room_type_id
         JOIN hotel h ON r.hotel_id = h.hotel_id
         WHERE r.room_id = ?`,
        [roomId]
      );

      console.log('roomDetails:', roomDetails);
  
      if (!roomDetails.length) {
        return res.status(404).json({ error: 'Room not found' });
      }
      
  
      const [userDetails] = await db.promise().query(
        `SELECT username AS name, email
         FROM users
         WHERE user_id = ?`,
        [userId]
      );
  
      const [coupons] = await db.promise().query(
        `SELECT c.coupon_code AS code, c.discount_rate
         FROM coupon c
         JOIN coupon_history ch ON c.coupon_id = ch.coupon_id
         WHERE ch.user_id = ?`,
        [userId]
      );
  
      const [paymentMethods] = await db.promise().query(
        `SELECT payment_method_id AS id, method_name AS name
         FROM payment_method`
      );

      const [bookingDetails] = await db.promise().query(
        `SELECT checkin_date, checkout_date
         FROM booking
         WHERE user_id = ? AND room_id = ?`,
        [userId, roomId]
      );
  
      res.json({
        room: {
          ...roomDetails[0],
          schedule: bookingDetails.length
            ? `${bookingDetails[0].checkin_date} ~ ${bookingDetails[0].checkout_date}`
            : '예약 정보 없음',
        },
        user: userDetails[0] || { name: 'N/A', email: 'N/A' },
        coupons,
        paymentMethods,
      });

    } catch (error) {
      console.error('API Error:', error.message); // 에러 메시지를 출력
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;