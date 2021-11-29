const {
  USER_STATUS,
} = require('../../config/constants');
const SpecializationService = require('../../services/specialization.service');
const RoomService = require('../../services/room.service');
const UserService = require('../../services/user.service');

class MemberSocket {
  constructor() {
    this.userService = UserService;
    this.specializationService = SpecializationService;
    this.roomService = RoomService;
    this.chatRooms = {};
  }

  getDoctorsFromSpecRoom(socket, specRooms) {
    socket.on('get-doctor-from-spec-room', (specId, callback) => {
      if (!(specId in specRooms)) {
        callback(`there have no doctors in this specialization online`);
      }
      const doctors = specRooms.specId;
      callback(doctors);
    });
  }

  openChatRoom(socket, userRooms) {
    socket.on('join-chat-room', async (options, callback) => {
      const { roomId, userId } = options;
      try {
        socket.join(roomId);
        // set this user read all messages in this room
        await this.roomService.setUserReadMessage({ userId, roomId });
        // find user in users room
        const user = userRooms.find((user) => user.userId === userId);
        user.status = USER_STATUS.busy;
        // add user to chat room
        const room = Object.keys(this.chatRooms).find((room) => room === roomId);
        if (!room) {
          this.chatRooms[roomId] = [];
          this.chatRooms[roomId].push(user);
        } else {
          room.push(user);
        }

        callback(`joined room ${roomId}`);
      } catch (error) {
        callback(`cannot join room ${roomId}`);
      }
    });
  }

  leaveChatRoom(socket) {
    socket.on('leave-chat-room', (roomId, callback) => {
      try {
        socket.leave(roomId);
        callback(`left room ${roomId}`);
      } catch (error) {
        callback(`failed when leave room ${roomId}`);
      }
    });
  }
}

module.exports = new MemberSocket();
