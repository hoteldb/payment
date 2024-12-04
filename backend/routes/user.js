const express = require('express');
const pool = require('../models/db'); // MySQL 연결 가져오기
const router = express.Router();

router.get('/user-info', async (req, res) => {
  const userId = req.query.userId; // 현재 로그인된 사용자의 ID
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.username, 
        u.email,
        GROUP_CONCAT(DISTINCT c.coupon_code) AS coupons
      FROM users u
      LEFT JOIN coupon_history ch ON u.user_id = ch.user_id
      LEFT JOIN coupon c ON ch.coupon_id = c.coupon_id
      WHERE u.user_id = ? AND c.valid_to >= CURDATE();
    `, [userId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user-coupons', async (req, res) => {
    const { userId } = req.query;
  
    try {
      const query = `
        SELECT c.coupon_code, c.discount_rate 
        FROM coupon c
        JOIN coupon_history ch ON c.coupon_id = ch.coupon_id
        WHERE ch.user_id = ?
      `;
      const [rows] = await db.promise().query(query, [userId]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user coupons' });
    }
  });

module.exports = router;
