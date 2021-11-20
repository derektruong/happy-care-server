const logger = require('../../config/logger');
const { ROOM_NAME } = require('../../config/constants');
const UserService = require('../../services/user.service');

class AppSocket {
  constructor() {
    this.users = [];
    this.doctors = [];
    this.members = [];
    this.userService = UserService;
  }

  userJoinRoomHandler(socket) {
    socket.on('join', (token, callback) => {
      const rs = this.userService.verifyUserRole(token);
      if (rs) {
        const { userId, userRole } = rs;
        logger.Info(`${userRole} with id ${userId}`);
        callback(this.addUser({ socket, userId, userRole }));
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
      if (this.doctors.length > 0) {
        callback({ doctors: this.doctors });
      } else {
        callback('cannot found any doctors');
      }
    });

    socket.on('get-members-in-app', (message, callback) => {
      logger.Info(`get-members-in-app: ${message}`);
      if (this.members.length > 0) {
        callback({ members: this.members });
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
      callback({ numberOfDoctors: this.doctors.length });
    });

    socket.on('get-number-of-members', (message, callback) => {
      logger.Info(`get-number-of-members: ${message}`);
      callback({ numberOfMembers: this.members.length });
    });
  }

  disconnectHandler(socket) {
    socket.on('disconnect', () => {
      this.removeUser({ socketId: socket.id });
      logger.Info('a user disconnected');
    });
  }

  addUser({ socket, userId, userRole }) {
    const isExistUser = this.users.find((user) => user.userId === userId);

    if (!isExistUser) {
      if (userRole === 'doctor') {
        this.users.push({ id: socket.id, userId });
        this.doctors.push({ id: socket.id, userId });
        socket.join(ROOM_NAME.doctorRoom);
      } else if (userRole === 'member') {
        this.users.push({ id: socket.id, userId });
        this.members.push({ id: socket.id, userId });
        socket.join(ROOM_NAME.memberRoom);
      }

      return `${userRole} join the app successfully`;
    }

    return 'user cannot join the app';
  }

  removeUser({ socketId }) {
    const user = this.users.find((user) => user.id === socketId);
    if (user) {
      this.users = this.users.filter((user) => user.id !== socketId);

      if (user.userRole === 'doctor') {
        this.doctors = this.doctors.filter((user) => user.id !== socketId);
      } else if (user.userRole === 'member') {
        this.members = this.members.filter((user) => user.id !== socketId);
      }
    }
  }
}

module.exports = new AppSocket();
