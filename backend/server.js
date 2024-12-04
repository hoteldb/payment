const express = require("express");
const mysql = require("mysql2");
const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0213",
  database: "hotel_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

app.use(express.json());

// API to fetch hotel details
app.get("/api/hotels/:id", (req, res) => {
    const hotelId = req.params.id;
  
    // 호텔 정보를 가져오는 SQL 쿼리
    const hotelQuery = `
      SELECT 
        hotel.hotel_name, 
        hotel.rating_avg, 
        hotel.price_range, 
        hotel.hotel_description, 
        hotel_image.hotel_image_url, 
        location.city_name, 
        location.country_name 
      FROM hotel
      LEFT JOIN hotel_image ON hotel.hotel_id = hotel_image.hotel_id
      LEFT JOIN location ON hotel.location_id = location.location_id
      WHERE hotel.hotel_id = ?;
    `;
  
    // 해당 호텔의 리뷰를 가져오는 SQL 쿼리
    const reviewQuery = `
      SELECT 
        review.rating, 
        review.comments, 
        users.username, 
        review.review_date 
      FROM review
      LEFT JOIN users ON review.user_id = users.user_id
      WHERE review.hotel_id = ?;
    `;
  
    // 데이터베이스에서 호텔 정보와 리뷰를 동시에 가져오기
    db.query(hotelQuery, [hotelId], (err, hotelResults) => {
      if (err) {
        console.error("Error fetching hotel data:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
  
      // 호텔 정보가 존재하지 않으면 404
      if (hotelResults.length === 0) {
        res.status(404).json({ error: "Hotel not found" });
        return;
      }
  
      const hotelData = hotelResults[0];
  
      db.query(reviewQuery, [hotelId], (err, reviewResults) => {
        if (err) {
          console.error("Error fetching reviews:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
  
        // 리뷰 데이터를 함께 반환
        res.json({
          hotel: hotelData,
          reviews: reviewResults,
        });
      });
    });
  });
