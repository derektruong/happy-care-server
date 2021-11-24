const SpecializationService = require('../../services/specialization.service');

class MemberSocket {
	constructor() {
		this.specializationService = SpecializationService;
	}

	broadcastSpecToRooms(socket) {
		socket.on('broadcast-spec-to-doctor', (specName, callback) => {
			const specId = this.specializationService.getSpecIdByName({ specName });
			socket.broadcast.to(specId).emit('broadcast-spec-to-doctor', specName);
		});
	}
}
