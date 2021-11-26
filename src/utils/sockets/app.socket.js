const logger = require('../../config/logger');
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
        logger.Info(`${userRole} with id ${userId}`);
        callback(await this.addUser({ socket, userId, userRole }));
      } else {
        callback('user is not valid');
      }
    });
  }

  getUsersInAppHandler(socket) {
    socket.on('get-users-in-app', (message, callback) => {
      logger.Info(`get-users-in-app: ${message}`);
      if (this.users.length > 0) {
        callback({ users: this.users });
      } else {
        callback('cannot found any users');
      }
    });

    socket.on('get-doctors-in-app', (message, callback) => {
      logger.Info(`get-doctors-in-app: ${message}`);
      const doctors = this.users.filter((user) => user.userRole === 'doctor');
      if (doctors.length > 0) {
        callback({ doctors });
      } else {
        callback('cannot found any doctors');
      }
    });

    socket.on('get-members-in-app', (message, callback) => {
      logger.Info(`get-members-in-app: ${message}`);
      const members = this.users.filter((user) => user.userRole === 'member');
      if (members.length > 0) {
        callback({ members });
      } else {
        callback('cannot found any members');
      }
    });
  }

  getNumberOfUsersHandler(socket) {
    socket.on('get-number-of-users', (message, callback) => {
      logger.Info(`get-number-of-users: ${message}`);
      callback({ numberOfUsers: this.users.length });
    });

    socket.on('get-number-of-doctors', (message, callback) => {
      logger.Info(`get-number-of-doctors: ${message}`);
      const doctors = this.users.filter((user) => user.userRole === 'doctor');
      callback({ numberOfDoctors: doctors.length });
    });

    socket.on('get-number-of-members', (message, callback) => {
      logger.Info(`get-number-of-members: ${message}`);
      const members = this.users.filter((user) => user.userRole === 'member');
      callback({ numberOfMembers: members.length });
    });
  }

  getSocketRooms(io, socket) {
    socket.on('get-socket-rooms', (message, callback) => {
      logger.Info(`get-socket-rooms: ${message}`);
      callback({ rooms: io.sockets.adapter.rooms });
    })
  }

  disconnectHandler(socket) {
    socket.on('disconnect', () => {
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

