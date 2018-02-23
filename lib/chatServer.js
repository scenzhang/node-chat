const io = require('socket.io')

let numGuests = 0;
let nicks = {};

const chatServer = {
  handleMessageBroadcast(socket) {
    socket.on('message', (message) => {
      console.log(message);
      socket.broadcast.emit('message', message);
    })
  },
  listen (server) {
    chat = io(server)

    chat.on('connection', (socket) => {
      console.log(`connected from ${socket.id}`);

      this.handleMessageBroadcast(socket);
    });

  }
};

module.exports = chatServer;