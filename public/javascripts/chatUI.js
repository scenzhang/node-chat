const Chat = require('./chat')

class ChatUI {
  constructor(socket) {
    this.chat = new Chat(socket);
    this.form = $("#chat-form");
    this.messages = $("#messages");
    this.input = $("#chat-field");
    this.addSubmitHandler();
    this.name = "";
    this.room = $("#room");
    this.users = $("#room-users");
  }
  changeName(name) {
    this.systemMessage(`You are now known as ${name}`);
    this.name = name;
  }
  sendMessage() {
    this.chat.sendMessage(this.getInput());
  }

  processInput() {
    const input = this.getInput();
    if (input[0] === '/') {
      let response = this.chat.processCommand(input);
      if (response) {
        this.systemMessage(response);
      }
    } else {
      this.sendMessage();
      this.addMessage({
        user: this.name,
        text: input
      });
    }
  }
  systemMessage(message) {
    this.addMessage({ user: "System", text: message});
  }
  addMessage(message) {
    let newMsg = $(`<li>${new Date()} ${message.user}: ${message.text}</li>`);
    this.messages.append(newMsg);
  }
  changeRoom(room) {
    this.room.html(room);
  }
  getInput() {
    return this.input.val();
  }
  addSubmitHandler() {
    this.form.submit((e) => {
      e.preventDefault();
      if (!this.getInput()) return;
      this.processInput();
      this.input.val("");
      this.input.focus();
    });
  }
}

module.exports = ChatUI