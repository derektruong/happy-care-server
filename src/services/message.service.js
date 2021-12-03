const moment = require('moment');
const MessageModel = require('../models/message.model');

const saveMessage = async ({ messageContent, messageType, roomId, userId }) => {
  try {
    const messageData = {
      content: messageContent,
	  type: messageType,
      user: userId,
      room: roomId,
      time: moment(),
    };
    const message = MessageModel(messageData);
    await message.save();

    return message;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMessages = async ({ roomId, start, limit }) => {
  try {
    const messages = await MessageModel
							.find({ room: roomId, isDeleted: false })
							.sort({ time: -1 })
							.skip(Number(start))
							.limit(Number(limit))
							.lean();
    return messages;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteMessageById = async ({ userId, roomId, messageId }) => {
  try {
    const message = await MessageModel.findOne({
      _id: messageId,
      user: userId,
      room: roomId,
    });
    if (!message) {
      throw {
        status: 404,
        message: 'message not found',
      };
    }
    message.isDeleted = true;
    await message.save();
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

module.exports = {
  saveMessage,
  getMessages,
  deleteMessageById,
};
