const logger = require('../../config/logger');
const AppSocket = require('./app.socket');
const RoomSocket = require('./room.socket');
const MessageSocket = require('./message.socket');

class WebSockets {
  constructor() {
    this.appSocket = AppSocket;
    this.roomSocket = RoomSocket;
    this.messageSocket = MessageSocket;
  }
  connection(io) {
    io.on('connection', (socket) => {
      logger.Info('a new user connected');

      //#region APP SOCKET
      // handle on 'join' event after user login
      this.appSocket.userJoinRoomHandler(socket);

      // handle on 'get-[users || doctors || members]-in-app'
      this.appSocket.getUsersInAppHandler(socket);

      // handle on 'get-number-of-[users | doctors | members]'
      this.appSocket.getNumberOfUsersHandler(socket);

      // handle on 'get rooms in current socket io'
      this.appSocket.getSocketRooms(io, socket);

      // handle on 'disconnect' event
      this.appSocket.disconnectHandler(socket);
      //#endregion

      //#region ROOM SOCKET
      // handle on 'join' event after user login
      this.roomSocket.getDoctorsFromSpecRoom(socket, this.appSocket.specRooms);

      // handle on 'open chat room with doctor'
      this.roomSocket.openChatRoom(socket, this.appSocket.users);

      // handle on 'leave room' when user leave room
      this.roomSocket.leaveChatRoom(socket);
      //#endregion

      //#region  MESSAGE SOCKET
      // handle on 'send message'
      this.messageSocket.sendMessage(socket, this.roomSocket.chatRooms);

      // handle on 'typing in room'
      this.messageSocket.typingInRoom(socket);

      //#endregion
    });
  }
}

module.exports = WebSockets;