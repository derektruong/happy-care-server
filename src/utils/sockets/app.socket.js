const logger = require('../../config/logger');
const { generateBasicAck } = require('../helpers/socket.helper');
const { ROOM_NAME, USER_STATUS } = require('../../config/constants');
const UserService = require('../../services/user.service');
const SpecializationService = require('../../services/specialization.service');

class AppSocket {
  constructor() {
    this.userService = UserService;
    this.specializationService = SpecializationService;
    this.users = [];
    this.specRooms = {};
  }

  userJoinRoomHandler(socket) {
    socket.on('join', async (token, callback) => {
      const rs = this.userService.verifyUserRole(token);
      if (rs) {
        const { userId, userRole } = rs;
        logger.Info(`on event 'join': ${userRole} with id ${userId}`);
        callback(generateBasicAck(true, false, await this.addUser({ socket, userId, userRole })));
      } else {
        callback(generateBasicAck(false, true, 'user cannot join the app'));
      }
    });
  }

  getUsersInAppHandler(socket) {
    socket.on('get-users-in-app', (message, callback) => {
      logger.Info(`on event 'get-users-in-app': ${message}`);
      if (this.users.length > 0) {
        callback({
          ...generateBasicAck(true, false, 'get users in app successfully'),
          data: {
            users: this.users,
          }
        });
      } else {
        callback(generateBasicAck(false, true, 'cannot found any users'));
      }
    });

    socket.on('get-doctors-in-app', (message, callback) => {
      logger.Info(`on event 'get-doctors-in-app': ${message}`);
      const doctors = this.users.filter((user) => user.userRole === 'doctor');
      if (doctors.length > 0) {
        callback({
          ...generateBasicAck(true, false, 'get users in app successfully'),
          data: {
            doctors,
          }
        });
      } else {
        callback(generateBasicAck(false, true, 'cannot found any doctors'));
      }
    });

    socket.on('get-members-in-app', (message, callback) => {
      logger.Info(`on event 'get-members-in-app': ${message}`);
      const members = this.users.filter((user) => user.userRole === 'member');
      if (members.length > 0) {
        callback({
          ...generateBasicAck(true, false, 'get users in app successfully'),
          data: {
            members,
          }
        });
      } else {
        callback(generateBasicAck(false, true, 'cannot found any members'));
      }
    });
  }

  getNumberOfUsersHandler(socket) {
    socket.on('get-number-of-users', (message, callback) => {
      logger.Info(`on event 'get-number-of-users': ${message}`);
      callback({
        ...generateBasicAck(true, false, 'get number of users in app successfully'),
        data: {
          numberOfUsers: this.users.length,
        }
      });
    });

    socket.on('get-number-of-doctors', (message, callback) => {
      logger.Info(`on event 'get-number-of-doctors': ${message}`);
      const doctors = this.users.filter((user) => user.userRole === 'doctor');
      callback({
        ...generateBasicAck(true, false, 'get number of doctors in app successfully'),
        data: {
          numberOfDoctors: doctors.length,
        }
      });
    });

    socket.on('get-number-of-members', (message, callback) => {
      logger.Info(`on event 'get-number-of-members': ${message}`);
      const members = this.users.filter((user) => user.userRole === 'member');
      callback({
        ...generateBasicAck(true, false, 'get number of members in app successfully'),
        data: {
          numberOfDoctors: members.length,
        }
      });
    });
  }

  getSocketRooms(io, socket) {
    socket.on('get-socket-rooms', (message, callback) => {
      logger.Info(`on event 'get-socket-rooms': ${message}`);
      callback({
        ...generateBasicAck(true, false, 'get rooms of servers successfully'),
        data: {
          rooms: io.sockets.adapter.rooms,
        }
      });
    })
  }

  disconnectHandler(socket) {
    socket.on('disconnect', () => {
      logger.Info(`on event 'disconnect'`);
      this.removeUser({ socketId: socket.id });
      logger.Info('a user disconnected');
    });
  }

  async addUser({ socket, userId, userRole }) {
    const isExistUser = this.users.find((user) => user.userId === userId);
    if (isExistUser) return 'user cannot join the app';
    this.users.push({ 
      id: socket.id, 
      userId,
      userRole,
      status: USER_STATUS.online,
    });
    socket.join(ROOM_NAME.userRoom);
    socket.join(userId);

    if (userRole === 'doctor') {
      // handle doctor after join app can also join their specialization room
      const specIds = await this.specializationService.getAllSpecializationIds();
      const userSpecIds= await this.userService.getAllSpecializationsByUserId({ userId });
      const doctorSpecRooms = await this.doctorJoinInSpecRooms({ socket, specIds, userSpecIds, userId });

      if (doctorSpecRooms.length === 0) {
        logger.Info(`doctor with id ${userId} doesn't join any spec rooms`);
      } else {
        logger.Info(`doctor with id ${userId} joined in ${doctorSpecRooms.length} spec rooms`);
      }
    }
    return `${userRole} join the app successfully`;
  }

  removeUser({ socketId }) {
    const user = this.users.find((user) => user.id === socketId);
    if (user) {
      this.users = this.users.filter((user) => user.id !== socketId);

      if (user.userRole === 'doctor') {
        // remove doctor from spec room
        const specIds = Object.keys(this.specRooms);
        specIds.forEach((specId) => {
          this.specRooms[specId] = this.specRooms[specId].filter((user) => user.id !== socketId);
          if (this.specRooms[specId].length === 0) {
            delete this.specRooms[specId];
          }
        });
      } 
    }
  }

  async doctorJoinInSpecRooms({ socket, specIds, userSpecIds, userId }) {
    const filterSpecIds = specIds.filter((specId) => userSpecIds.includes(specId));
    if (filterSpecIds.length > 0) {
      filterSpecIds.forEach((specId) => {
        if (!(specId in this.specRooms)) {
          this.specRooms[specId] = [];
          this.specRooms[specId].push({
            userId,
            status: USER_STATUS.online,
            id: socket.id,
          });
        }
        socket.join(specId);
      });
    }
    return filterSpecIds;
  }
}


module.exports = new AppSocket();

