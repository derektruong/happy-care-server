const { ERROR_MESSAGE } = require('../../config/constants');
const { generateBasicAck } = require('../helpers/socket.helper');
const logger = require('../../config/logger');
const MessageService = require('../../services/message.service');

class MessageSocket {
  constructor() {
    this.messageService = MessageService;
  }

  async sendMessage(socket) {
    socket.on('send-message', async (data, callback) => {
      logger.Info(`on event 'send-message' to roomId: ${roomId} with userId: ${userId}`);
      try {
        const { message, roomId, userId } = data;
        const newMessage = await this.messageService.saveMessage({
          messageContent: message,
          roomId,
          userId,
        });
        socket.broadcast
          .to(roomId)
          .emit('receive-message', {
            message,
            user: newMessage.user,
            time: newMessage.time,
          });
        callback(
          generateBasicAck(true, false, 'message was sent successfully')
        );
		logger.Info(`emit event 'receive-message' to roomId: ${roomId} with userId: ${userId} and time: ${newMessage.time}`);
      } catch (error) {
        callback(generateBasicAck(false, true, error.message));
      }
    });
  }
}

module.exports = new MessageSocket();
