const logger = require('../../config/logger');
const AppSocket = require('./app.socket');
const MemberSocket = require('./member.socket');

class WebSockets {
  constructor() {
    this.appSocket = AppSocket;
    this.memberSocket = MemberSocket;
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

      //#region MEMBER SOCKET
      // handle on 'join' event after user login
      this.memberSocket.getDoctorsFromSpecRoom(socket, this.appSocket.specRooms);
      //#endregion
    });
  }
}

module.exports = WebSockets;