// 전역 변수
const chatBody = document.querySelector('.chat-body');
const userTitle = document.querySelector('user-title');
const loginContainer = document.querySelector('.login-container');
const userTable = document.querySelector('.users');
const userTagLine = document.querySelector('#users-tagline');
const title = document.querySelector('#active-user');
const messages = document.querySelector('.messages');
const msgDiv = document.querySelector('.msg-form');



// 클라이언트는 로그인을 한 후 연결 시키기 위해 자동 연결 X
const socket = io('http://localhost:4000', {
  autoConnect: false
})


// 클라이언트의 모든 메세지 Log보기
socket.onAny((event, ...args) => {
  console.log(event, ...args);
})



// login form handler
const loginForm = document.querySelector('.user-login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username');
  createSession(username.value.toLowerCase());
  username.value = '';
})

const createSession = async(username) => {
  await fetch('/session', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username})
  })
  .then((res) => res.json())
  .then((data) => {
    // 클라이언트 이름과 서버에서 만든 Id를 준다
    socketConnect(data.username, data.userID);

    // 세션 데이터를 로컬스토리지에 저장하기 (페이지 리프레쉬 했을 때 이걸로 로그인)
    localStorage.setItem('session-username', data.username);
    localStorage.setItem('session-userID', data.userID);

    // 로그인 후 로그인 화면 삭제하고 채팅창 보이기
    loginContainer.classList.add('d-none');
    chatBody.classList.remove('d-none');
    userTitle.innerHTML = data.username;
  })
  .catch(err => {
    console.log(err);
  })
}

const socketConnect = async(username, userID) => {
  socket.auth = {username, userID}
  await socket.connect();
}