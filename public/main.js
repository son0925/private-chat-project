// 전역 변수
const chatBody = document.querySelector('.chat-body');
const userTitle = document.querySelector('user-title');
const loginContainer = document.querySelector('.login-container');
const userTable = document.querySelector('.users');
const userTagLine = document.querySelector('#users-tagline');
const title = document.querySelector('#active-user');
const messages = document.querySelector('.messages');
const msgDiv = document.querySelector('.msg-form');



// 클라이언트는 들어가자마자 접근을 하지 않고 원하는 유저와 대화하기 위해 자동 연결 X
const socket = io('http://localhost:4000', {
  autoConnect: false
})


// 클라이언트의 모든 메세지 Log보기
socket.onAny((event, ...args) => {
  console.log(event, ...args);
})