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

  openChatRoom(socket, userRoom) {
    socket.on('join-chat-room', async (options, callback) => {
      const { roomId, userId } = options;
      try {
        socket.join(roomId);
        // set this user read all messages in this room
        await this.roomService.setUserReadMessage({ userId, roomId });
        // find user in users room
        const user = userRoom.find((user) => user.userId === userId);
        user.status = USER_STATUS.busy;

        // notify to doctor
        // const members = this.roomService.getMembersFromRoom(roomId);

        // members.forEach((member) => {
        //   if (member.userId !== userId) {
        //     member.socket.emit('new-user-join-room', user);
        //   }
        // });
      
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
