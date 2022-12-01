//required for front end communication between client and server

const socket = io();

const inboxPeople = document.querySelector(".inbox__people");


let userName = "";
let id;
let message = document.getElementById("message");
let typing = document.getElementById("typing");
let joined = document.getElementById("join");
const newUserConnected = function (data) {


    //give the user a random unique id
    id = Math.floor(Math.random() * 1000000);
    userName = 'user-' +id;
    //console.log(typeof(userName));


    //emit an event with the user id
    socket.emit("new user", userName);
    //call
    addToUsersBox(userName);
};


message.addEventListener("keypress", () => {
  socket.emit("typing", userName.value)
})



const addToUsersBox = function (userName) {
    //This if statement checks whether an element of the user-userlist
    //exists and then inverts the result of the expression in the condition
    //to true, while also casting from an object to boolean
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;

    }

    //setup the divs for displaying the connected users
    //id is set to a string including the username
    const userBox = `
    <div class="chat_id ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
    //set the inboxPeople div with the value of userbox
    inboxPeople.innerHTML += userBox;
};

//call
newUserConnected();
    //appendMessage("you joined");

//when a new user event is detected
socket.on("new user", function (data) {
    data.map(function (user) {
        return addToUsersBox(user);
    });
});
    //joined.innerHTML = `<p>${user} joined</p>`;
socket.on("user-connected", (userId) => {
  messageBox.innerHTML += `<p class="join_disjoin">${userId} joined</p>`;
      //joined.innerHTML = `<p>${userId} joined</p>`;           // WORKING
      //messageBox.innerHTML += `<p>${user} joined</p>`;       show joint for all users(?)
      /*let joined = `<p>${user} joined</p>`;
      messageBox.innerHTML += joined; */
      /*const myMsg = `
        <div class="outgoing__message">
          <div class="sent__message">
            <p>${user} joined</p>
          </div>
        </div>`;
    })*/
    //let number = activeUsers.size;
    //document.getElementById("active_users").innerHTML = number;
});

//when a user leaves
socket.on("user disconnected", function (userName) {
    /*appendMessage(`${userName} leaves`)*/
    document.querySelector(`.${userName}-userlist`).remove();
});
socket.on("user-disconnected", (userId) => {
  messageBox.innerHTML += `<p class="join_disjoin">${userId} disjoined</p>`;
});


//my code
/*socket.on("chat message", data => {
  appendMessage(data)
})*/
/*socket.on("new user", userName =>{
  appendMessage(`${userName} connected`)
})*/

const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");

const addNewMessage = ({ user, message }) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

    const receivedMsg = `
  <div class="incoming__message">
    <div class="received__message">
      <p >${message}</p>
      <div class="message__info">
        <span class="message__author">${user}</span>
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

    const myMsg = `
  <div class="outgoing__message">
    <div class="sent__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

    //is the message sent or received
    messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputField.value) {
        return;
    }

    socket.emit("chat message", {
        message: inputField.value,
        nick: userName,
    });

    inputField.value = "";
});

socket.on("chat message", function (data) {
    addNewMessage({ user: data.nick, message: data.message });
});




socket.on("typing", (userId) => {
  typing.innerHTML = `<p>${userId} is typing...</p>`;
  setTimeout(() => {
      typing.innerHTML = "";
  }, 3000);
});


/*socket.on('message', function (data) {
    //console.log(data.count);
    let num = getElementById("active_users");
    num.innerHTML = `<p>${data.count}</p>`;
});*/