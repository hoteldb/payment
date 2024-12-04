const express = require('express');
const router = express.Router();
const db = require('../models/db'); // MySQL 연결

module.exports = router; // 반드시 추가되어야 함


// /api/hotel/hotel-details
router.get('/hotel-details', async (req, res) => {
  const { hotelId, userId } = req.query; // URL에서 파라미터 가져오기
  console.log('API 요청:', { hotelId, userId }); // 디버깅 로그

  try {
    // 호텔 기본 정보
    const [hotelDetails] = await db.promise().query(`
      SELECT 
        h.hotel_name, h.rating_avg, h.price_range,
        l.city_name, l.country_name,
        ht.gym, ht.spa, ht.pool, ht.jazz_bar,
        ht.business_lounge, ht.sky_lounge, ht.rooftop,
        ht.boufet, ht.no_smoking, ht.terrace
      FROM hotel h
      LEFT JOIN location l ON h.location_id = l.location_id
      LEFT JOIN hotel_type ht ON h.hotel_type_id = ht.hotel_type_id
      WHERE h.hotel_id = ?
    `, [hotelId]);

    // 호텔 사진
    const [hotelImages] = await db.promise().query(`
      SELECT hotel_image_url
      FROM hotel_image
      WHERE hotel_id = ?
    `, [hotelId]);

    // 객실 사진 및 정보
    const [roomDetails] = await db.promise().query(`
        SELECT r.room_id, rt.room_name, rt.room_price, rt.room_image_url
        FROM room r
        JOIN room_type rt ON r.room_type_id = rt.room_type_id
        WHERE r.hotel_id = ?
      `, [hotelId]);

      console.log('roomDetails:', roomDetails);

    // 리뷰
    const [reviews] = await db.promise().query(`
      SELECT r.rating, r.comments, u.username
      FROM review r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.hotel_id = ?
    `, [hotelId]);

    // 호텔 이벤트
    const [events] = await db.promise().query(`
      SELECT event_name, event_date, event_description
      FROM event
      WHERE hotel_id = ?
    `, [hotelId]);

    // JSON 응답 반환
    res.json({
      hotel: hotelDetails[0],
      hotelImages,
      roomDetails,
      reviews,
      events,
    });
  } catch (error) {
    console.error('API 에러:', error.message); // 디버깅용
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
