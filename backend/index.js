
const express = require('express');
const app = express();

// 기본 경로에 응답하기
app.get('/', (req, res) => {
    res.send('Hello from Backend!');
});

// 서버 실행하기
const PORT = 3001; // 프론트엔드와 다른 포트를 사용
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});