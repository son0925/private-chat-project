// 서버 필요 모듈
const express = require('express');
const port = 4000;
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();


// 정적 파일 위치와 제공
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath));
// json 파싱
app.use(express.json());

// 메모리에 로그인 한 유저 저장
let users = [];



// MongoDB 연결
mongoose.connect(process.env.MONGO_URL)
  .then(() => {console.log('Mongo Connect')})
  .catch((err) => {console.log(err)})



// 클라이언트, 서버 socket connection event
io.on('connection', async(socket) => {
  let userData = {};
  users.push(userData);
  // 서버가 모든 클라이언트에게 보내기
  io.emit('users-data', {users});

  // 클라이언트가 보낸 메세지
  socket.on('message-to-server', () => {})

  // 데이터베이스에서 메세지 가지고 오기
  socket.on('fetch-messages', () => {});

  // 유저가 방에서 나갔을 때
  socket.on('disconnect', () => {});
})


// 서버 listener
server.listen(port, () => {
  console.log(`Running on ${port}`);
})