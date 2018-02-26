class Chat {
  constructor(socket) {
    this.socket = socket;
  }

  sendMessage(msg, room) {
    console.log('send message');
    this.socket.emit('message', {
      text: msg,
      room
    });
  }
  changeName(name) {
    this.socket.emit('nickChange', name);
  }
  changeRoom(room) {
    this.socket.emit('join', { newRoom: room});
  }
  whisper(user, text) {
    this.socket.emit('whisper', { user, text });
  }

  processCommand(input) {
    const words = input.split(" ");
    const command = words[0].substring(1, words[0].length);
    let msg = false;
    switch (command) {
      case 'nick':
        words.shift();
        if (words.length > 1) {
          msg = "nickname must not contain spaces";
          break;
        }
        const newName = words[0];
        this.changeName(newName);
        break;
      case 'join':
        words.shift();
        const newRoom = words.join(" ");
        this.changeRoom(newRoom);
        break;
      case 'whisper':
      case 'w':
        words.shift();
        const wUser = words.shift();
        const msg = words.join(" ");
        this.whisper(wUser, msg);
        break;
      default:
        msg = 'Unrecognized command'
        break;
    }
    return msg;
  }
}

module.exports = Chat;