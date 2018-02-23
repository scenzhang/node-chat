const Chat = require('./chat')

class ChatUI {
  constructor(socket) {
    this.chat = new Chat(socket);
    this.form = $("#chat-form");
    this.messages = $("#messages");
    this.input = $("#chat-field");
    this.addSubmitHandler();

  }
  sendMessage() {
    this.chat.sendMessage(this.getInput());
  }
  processInput() {
    this.sendMessage();
    this.addMessage(this.getInput());
  }

  addMessage(message) {
    let newMsg = $(`<li>${message}</li>`);
    this.messages.append(newMsg);
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
