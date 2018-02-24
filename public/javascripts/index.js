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
  })

});