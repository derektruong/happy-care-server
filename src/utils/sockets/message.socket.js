const { ERROR_MESSAGE } = require('../../config/constants');
const MessageService = require('../../services/');

class MessageSocket {
  constructor() {
    this.messageService = new MessageService();
  }

  async sendMessage(socket) {
	socket.on('sendMessage', async (data, callback) => {
	  try {
		const { message, roomId, userId } = data;
		await this.messageService.sendMessage(message, userId);
		socket.emit('messageSent', { message });
	  } catch (error) {
		socket.emit('messageSent', { message: ERROR_MESSAGE });
	  }
	});
  }
}
