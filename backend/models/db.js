const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',      // MySQL 서버 주소
  user: 'root',           // MySQL 사용자 이름
  password: '0213', // MySQL 비밀번호
  database: 'hotel_db',   // 사용할 데이터베이스 이름
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err.message);
    return;
  }
  console.log('MySQL에 성공적으로 연결되었습니다!');
});

module.exports = db;
