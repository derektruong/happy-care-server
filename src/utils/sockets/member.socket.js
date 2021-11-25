const SpecializationService = require('../../services/specialization.service');

class MemberSocket {
	constructor() {
		this.specializationService = SpecializationService;
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
}

module.exports = new MemberSocket();
