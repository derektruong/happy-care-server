const { ERROR_MESSAGE } = require('../../config/constants');
const SpecializationService = require('../../services/specialization.service');
const RoomService = require('../../services/room.service');

class MemberSocket {
  constructor() {
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

  openRoomWithDoctor(socket, userRoom) {
    socket.on('join-room-with-doctor', (options, callback) => {
      const { memberId, doctorId } = options;
      const member = userRoom.find((user) => user.userId === memberId);
      const doctor = userRoom.find((user) => user.userId === doctorId);

      if (!member || !doctor) {
        return callback(`there is no member or doctor with this id is online`);
      } else if (member.status === 'busy' || doctor.status === 'busy') {
        return callback(`the member or doctor is busy`);
      }

      const literalName = `${member.fullname}-${doctor.fullname}`;
      const room = this.roomService.verifyRoom({ literalName, memberId, doctorId });

      callback(room);
    });
  }
}

module.exports = new MemberSocket();
