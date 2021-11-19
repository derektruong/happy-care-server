const logger = require('../config/logger');
const RoomService = require('../services/room.service');

class WebSockets {
	connection(io) {
		io.on('connection', (socket) => {
			logger.Info('a new user connected');

			// socket.on('join', (token, callback) => {
			// 	const canJoin = this.roomService.verifyRoom(token);
				
			// 	if (!canJoin) {
			// 		callback(false);
			// 	}
			// });
			this.joinDoctorRoomHandler(socket);
		})
	}

	joinDoctorRoomHandler(socket) {
		socket.on('join-doctor-room', (message, callback) => {
			logger.Info(message);
			callback();
		});
	}

}

module.exports = WebSockets;