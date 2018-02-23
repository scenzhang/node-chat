class Chat {
  constructor(socket) {
    this.socket = socket;
  }

  sendMessage(msg) {
    console.log('send message');
    this.socket.emit('message', {text: msg});
  }
}
module.exports = Chat;