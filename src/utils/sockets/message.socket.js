const { ERROR_MESSAGE } = require('../../config/constants');
const { generateBasicCallback } = require('../helpers/socket.helper');
const logger = require('../../config/logger');
const MessageService = require('../../services/message.service');

class MessageSocket {
  constructor() {
    this.messageService = MessageService;
  }

  async sendMessage(socket) {
	socket.on('send-message', async (data, callback) => {
	  try {
		const { message, roomId, userId } = data;
		const newMessage = await this.messageService.saveMessage({ message, roomId, userId });
		socket.broadcast.to(roomId).emit('receive-message', { message, user: newMessage.user, time: newMessage.time }, function (ackData) {
		  logger.Info(ackData);
		});
		callback(generateBasicCallback(true, false, 'message was sent successfully'));
	  } catch (error) {
		callback(generateBasicCallback(false, true, error.message));
	  }
	});
  }
}

module.exports = new MessageSocket();