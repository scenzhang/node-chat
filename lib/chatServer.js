const io = require('socket.io')

let numGuests = 0;
let nicks = {};
let nickSockets = {}; //store nick:socketid to make whispers faster
let rooms = {};
let roomUsers = {};
/*eventually store both user:room and room:user; 
this avoids the adjacency list/matrix tradeoff 
since we want both fast adjacency lookup as well as 
fast listing of 'neighbors'
*/
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
    nickSockets[name] = socket.id;
    socket.emit('namechange', {
      success: true,
      name: name
    });
  },
  roomList(socket) {
    const rooms = Object.keys(socket.rooms).filter(r => r !== socket.id); //keys of socket.rooms includes socket id for some reason
  },
  generateUserList(room, socket) {
    chat.of('/').in(`${room}`).clients((err, sockets) => {
      if (err) return console.error(err);
      const users = sockets.map(s => nicks[s]);
      chat.of('/').to(room).emit('userlist', users);

      // socket.emit('presentUsers', users);
    })
  },
  joinRoom(socket, room) {
    socket.join(room);
    rooms[socket.id] = room;
    // console.log(`${nicks[socket.id]} joining ${room}`);
    socket.emit('roomchange', {
      success: true,
      room: room
    });
    socket.broadcast.to(room).emit('userJoined', {
      user: nicks[socket.id]
    });
    this.generateUserList(room, socket);
  },
  handleRoomChange(socket) {
    socket.on('join', (room) => {
      socket.leave(rooms[socket.id]);
      socket.broadcast.to(rooms[socket.id]).emit("part", {
        user: nicks[socket.id]
      });
      this.generateUserList(rooms[socket.id]);
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
        nickSockets[newName] = socket.id;
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
  handleWhisper(socket) {
    socket.on('whisper', (whisper) => {
      console.log(whisper)
      socket.broadcast.to(nickSockets[whisper.user]).emit('whisper', {
        text: whisper.text,
        user: nicks[socket.id]
      });
    });
  },
  handleDisconnect(socket) {
    socket.on('disconnect', () => {
      socket.broadcast.to(rooms[socket.id]).emit("part", {
        user: nicks[socket.id]
      });
      this.generateUserList(rooms[socket.id], socket);
      delete nicks[socket.id];

      // chat.clients((_, clients) => console.log(clients));
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
      this.handleWhisper(socket);
    });

  }
};

module.exports = chatServer;