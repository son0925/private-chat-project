const socket = io('http://localhost:4000', {
  autoConnect: false
});


socket.onAny((event, ...args) => {
  console.log(event, ...args);
})


// 전역변수들
const chatBody = document.querySelector('.chat-body');
const userTitle = document.querySelector('#user-title');
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


socket.on('users-data', ({users}) => {
  // 자신은 제거하기
  const index = users.findIndex(user => user.userID === socket.id);
  if (index > -1) {
    users.splice(index,1);
  }

  let ul = `<table class='table table-hover'>`;
  for (const user of users) {
    ul += `<tr class="socket-users" onclick="setActiveUser(this, '${user.username}', '${user.userID}')"><td>${user.username}<span class="text-danger ps-1 d-none" id="${user.userID}">!</span></td></tr>`
  }

  ul += `</table>`;
  if (users.length > 0) {
    userTagline.innerHTML = '접속 중인 유저';
    userTagline.classList.remove('text-danger');
    userTagline.classList.add('text-success');
  } else {
    userTagline.innerHTML = '접속 중인 유저 없음';
    userTagline.classList.remove('text-success');
    userTagline.classList.add('text-danger');
  }
})


const sessUsername = localStorage.getItem('session-username');
const sessUserID = localStorage.getItem('session-userID');

if (sessUserID && sessUsername) {
  socketConnect(sessUsername, sessUserID);

  loginContainer.classList.add('d-none');
  chatBody.classList.remove('d-none');
  userTitle.innerHTML = sessUsername;
}