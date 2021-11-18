const logger = require('../config/logger');
const RoomService = require('../services/room.service');

class WebSockets {
	constructor(io) {
		this.io = io;
		this.roomService = RoomService;
	}

	init() {
		io.on('connection', (socket) => {
			logger.Info('a new user connected');

			socket.on('join', (token, callback) => {
				const canJoin = this.roomService.verifyRoom(token);

				if (!canJoin) {
					callback(false);
				}
			});
		})
	}

}