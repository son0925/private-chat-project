const socket = io('http://localhost:4000', {
  autoConnect: false
});


socket.onAny((event, ...args) => {
  console.log(event, ...args);
})


// 전역변수들
const chatBody = document.querySelector('.chat-body');
const userTitle = document.querySelector('.user-title');
const loginContainer = document.querySelector('.login-container');
const userTable = document.querySelector('.users');
const userTagline = document.querySelector('#users-tagline');
const title = document.querySelector('#active-user');
const messages = document.querySelector('.messages');
const msgDiv = document.querySelector('.msg-form');


// login form handler
const loginForm = document.querySelector('.user-login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username');
  createSession(username.value.toLowerCase());
  username.value = '';
})

const createSession = async(username) => {
  const option = {
    method: 'Post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username})
  }
  await fetch('/session', option)
    .then((res) => res.json())
    .then((data) => {
      socketConnect(data.username, data.userId)
      // localStorge 세션에 set
      localStorage.setItem('session-username', data.username);
      localStorage.setItem('session-userID', data.userId);

      loginContainer.classList.add('d-none');
      chatBody.classList.remove('d-none');
      userTitle.innerHTML = data.username
    })
    .catch((err) => {
      console.log(err);
    })
}


const socketConnect = async(username, userId) => {
  socket.auth = {username, userId};

  await socket.connect();
}