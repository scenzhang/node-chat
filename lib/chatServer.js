const io = require('socket.io')

let numGuests = 0;
let nicks = {};
let rooms = {};
let chat;
const chatServer = {
  handleMessageBroadcast(socket) {
    socket.on('message', (message) => {
      message.user = nicks[socket.id];
      socket.broadcast.to(rooms[socket.id]).emit('message', message);
    })
  },
  assignGuestName(socket, name, nicks) {
    nicks[socket.id] = name;
    socket.emit('namechange', {
      success: true,
      name: name
    });
  },
  roomList(socket) {
    const rooms = Object.keys(socket.rooms).filter(r => r !== socket.id); //keys of socket.rooms includes socket id for some reason
  },

  joinRoom(socket, room) {
    socket.join(room);
    rooms[socket.id] = room;
    console.log(`${nicks[socket.id]} joining ${room}`);
    socket.emit('roomchange', {
      success: true,
      room: room
    });
    socket.broadcast.to(room).emit('userJoined', {
      user: nicks[socket.id]
    });
  },
  handleRoomChange(socket) {
    socket.on('join', (room) => {
      socket.leave(rooms[socket.id]);
      this.joinRoom(socket, room.newRoom);
    })
  },
  handleNickChange(socket) {
    socket.on('nickChange', (newName) => {
      let nameUnique = true;
      for (const id in nicks) {
        if (nicks[id] === newName) {
          nameUnique = false;
          break;
        }
      }
      if (nameUnique) {
        nicks[socket.id] = newName;
        socket.emit('namechange', {
          success: true,
          name: newName
        });
      } else {
        socket.emit('namechange', {
          success: false,
          reason: 'Name taken'
        });
      }
    })
  },
  handleDisconnect(socket) {
    socket.on('disconnect', () => {
      socket.broadcast.to(rooms[socket.id]).emit("part", {
        user: nicks[socket.id]
      });
      delete nicks[socket.id];
    });

  },
  listen(server) {
    chat = io(server)

    chat.on('connection', (socket) => {
      this.assignGuestName(socket, `Anon${numGuests++}`, nicks);
      this.joinRoom(socket, "lobby");
      this.handleMessageBroadcast(socket);
      this.handleNickChange(socket);
      this.handleRoomChange(socket);
      this.handleDisconnect(socket);
    });

  }
};

module.exports = chatServer;