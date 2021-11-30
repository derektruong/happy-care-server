const logger = require('../../config/logger');
const {
  USER_STATUS,
} = require('../../config/constants');
const { generateBasicAck } = require('../helpers/socket.helper');
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
      logger.Info(`on event 'get-doctor-from-spec-room' with specId: ${specId}`);
      if (!(specId in specRooms)) {
        return callback(generateBasicAck(false, true, 'there have no doctors in this specialization online'));
      }
      const doctors = specRooms[specId];
      callback({
        ...generateBasicAck(true, false, 'get doctors from spec room successfully'),
        data: {
          doctors,
        }
      });
    });
  }

  openChatRoom(socket, userRooms) {
    socket.on('join-chat-room', async (options, callback) => {
      const { roomId, userId } = options;
      logger.Info(`on event 'join-chat-room' to roomId: ${roomId} and userId: ${userId}`);
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
          this.chatRooms[roomId].push(user);
        }
        callback(generateBasicAck(true, false, `joined room ${roomId}`));
      } catch (error) {
        callback(generateBasicAck(false, true, `cannot join room ${roomId}`));
      }
    });
  }

  leaveChatRoom(socket) {
    socket.on('leave-chat-room', (roomId, callback) => {
      try {
        logger.Info(`on event 'leave-chat-room' from roomId: ${roomId}`);
        socket.leave(roomId);
        callback(generateBasicAck(true, false, `left room ${roomId}`));
      } catch (error) {
        callback(generateBasicAck(false, true, `failed when leave room ${roomId}`));
      }
    });
  }
}

module.exports = new MemberSocket();
