const MessageService = require('../services/message.service');
const { generateBasicResponse } = require('../utils/helpers/api.helper');

const getMessages = async (req, res) => {
  try {
    const { start, limit } = req.query;
    const roomId = req.params.roomId;
    const messages = await MessageService.getMessages({ roomId, start, limit });
    return res.status(200).json({
      ...generateBasicResponse(true, false, 'get messages successfully'),
      data: messages,
    });
  } catch (error) {
    return generateBasicResponse(res, 500, error);
  }
};

const deleteMessageById = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messageId = req.params.messageId;
    const user = res.user;
    await MessageService.deleteMessageById({ userId: user._id, roomId, messageId });
    return res.status(200).json(generateBasicResponse(true, false, 'delete message successfully'));
  } catch (error) {
    const { status, message } = error;
    if (status === 404) {
      return res.status(404).json(generateBasicResponse(false, false, message));
    }
    res.status(500).json(generateBasicResponse(false, true, message));
  }
}

module.exports = {
  getMessages,
  deleteMessageById,
};
