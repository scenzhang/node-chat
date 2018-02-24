const io = require('socket.io')

let numGuests = 0;
let nicks = {};

const chatServer = {
  handleMessageBroadcast(socket) {
    socket.on('message', (message) => {
      message.user = nicks[socket.id];
      console.log(message);
      socket.broadcast.emit('message', message);
    })
  },
  assignGuestName(socket, name, nicks) {
    nicks[socket.id] = name;
    console.log(`assigning name ${name} to ${socket.id}`);
    socket.emit('namechange', {success: true, name: name});
  },
  handleNickChange(socket) {
    socket.on('nickChange', (newName) => {
      nicks[socket.id] = newName;
      socket.emit('namechange', {success: true, name: newName});
    })
  },
  listen (server) {
    chat = io(server)

    chat.on('connection', (socket) => {
      console.log(`connected from ${socket.id}`);
      this.assignGuestName(socket, `Guest${numGuests++}`, nicks);
      this.handleMessageBroadcast(socket);
      this.handleNickChange(socket);
    });

  }
};

module.exports = chatServer;