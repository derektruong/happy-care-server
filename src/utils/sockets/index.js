const logger = require('../../config/logger');
const AppSocket = require('./app.socket');
const UserSocket = require('./user.socket');
const MessageSocket = require('./message.socket');

class WebSockets {
  constructor() {
    this.appSocket = AppSocket;
    this.userSocket = UserSocket;
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

      //#region USER SOCKET
      // handle on 'join' event after user login
      this.userSocket.getDoctorsFromSpecRoom(socket, this.appSocket.specRooms);

      // handle on 'open chat room with doctor'
      this.userSocket.openChatRoom(socket, this.appSocket.users);

      // handle on 'leave room' when user leave room
      this.userSocket.leaveChatRoom(socket);
      //#endregion

      //#region  MESSAGE SOCKET
      // handle on 'send message'
      this.messageSocket.sendMessage(socket);

      //#endregion
    });
  }
}

module.exports = WebSockets;