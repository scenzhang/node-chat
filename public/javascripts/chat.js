class Chat {
  constructor(socket) {
    this.socket = socket;
  }

  sendMessage(msg) {
    console.log('send message');
    this.socket.emit('message', {
      text: msg
    });
  }

  processCommand(input) {
    const words = input.split(" ");
    const command = words[0].substring(1, words[0].length);
    let msg = false;
    switch (command) {
      case 'nick':
        words.shift();
        const newName = words.join(" ");
        this.socket.emit('nickChange', newName);
        break;
      default:
        msg = 'Unrecognized command'
        break
    }
    return msg;
  }
}

module.exports = Chat;