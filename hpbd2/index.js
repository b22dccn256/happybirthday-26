const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Route mặc định
app.get('/', (req, res) => {
    res.send('🎉 Happy Birthday App đang chạy trên Render!');
});

// Lắng nghe cổng
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
