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
const crypto = require('crypto');
const {saveMessages, fetchMessages} = require('./utils/messages');


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


// socket 미들웨어
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  const userID = socket.handshake.auth.userID;
  if (!username) {
    return next(new Error('Invalid username'));
  }

  socket.username = username;
  socket.id = userID;
  next()
})



// 클라이언트, 서버 socket connection event
io.on('connection', async(socket) => {
  let userData = {
    username: socket.username,
    userID: socket.id
  };
  users.push(userData);
  // 서버가 모든 클라이언트에게 보내기
  io.emit('users-data', {users});

  // 클라이언트가 보낸 메세지
  socket.on('message-to-server', (payload) => {
    io.to(payload.to).emit('message-to-client', payload);
    saveMessages(payload);  
  })

  // 데이터베이스에서 메세지 가지고 오기
  socket.on('fetch-messages', ({receiver}) => {
    fetchMessages(io, socket.id, receiver);


  });

  // 유저가 방에서 나갔을 때
  socket.on('disconnect', () => {
    users = users.filter(user => user.userID !== socket.id);
    // 사이드바 리스트에서 없애기
    io.emit('users-data', {users})

    // 대화중이라면 대화창 없애기
    io.emit('user-away', socket.id);
  });
})



const randomId = () => crypto.randomBytes(8).toString('hex');

app.post('/session', (req,res) => {
  const data = {
    username: req.body.username,
    userID: randomId()
  }
  res.send(data);
})


// 서버 listener
server.listen(port, () => {
  console.log(`Running on ${port}`);
})