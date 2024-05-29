// 서버 필요 모듈
const express = require('express');
const port = 4000;
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');


// 정적 파일 위치와 제공
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath));
// json 파싱
app.use(express.json());




// 서버 listener
server.listen(port, () => {
  console.log(`Running on ${port}`);
})