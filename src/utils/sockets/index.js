const logger = require('../../config/logger');
const AppSocket = require('./app.socket');

class WebSockets {
  constructor() {
    this.appSocket = AppSocket;
  }
  connection(io) {
    io.on('connection', (socket) => {
      logger.Info('a new user connected');

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
    });
  }
}

module.exports = WebSockets;