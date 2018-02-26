$(document).ready(()=> {
  const socket = require('socket.io-client')();
  const chatUI = require('./chatUI');
  const chat = new chatUI(socket);
  socket.on('message', (message) => {
    console.log('received message');
    chat.addMessage(message);
  });
  socket.on('namechange', (result) => {
    if (result.success) {
      chat.changeName(result.name);
    } else {
      chat.systemMessage(result.reason);
    }
  });
  socket.on('roomchange', (room) => {
    chat.systemMessage(`Joined ${room.room}`);
    chat.changeRoom(room.room);
  });
  socket.on('userJoined', (uj) =>{
    console.log(`${uj.user} has joined.`);
    chat.systemMessage(`${uj.user} has joined.`);
  });
  socket.on('part', (part) => {
    chat.systemMessage(`${part.user} has left.`);
  });
  socket.on('userlist', (userlist) => {
    console.log(userlist);
    chat.updateUserList(userlist);
  })

});