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

  processCommand(input) {
    const words = input.split(" ");
    const command = words[0].substring(1, words[0].length);
    let msg = false;
    switch (command) {
      case 'nick':
        words.shift();
        const newName = words.join(" ");
        this.changeName(newName);
        break;
      case 'join':
        words.shift();
        const newRoom = words.join(" ");
        this.changeRoom(newRoom);
        break;
      default:
        msg = 'Unrecognized command'
        break
    }
    return msg;
  }
}

module.exports = Chat;