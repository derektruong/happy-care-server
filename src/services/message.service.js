const moment = require('moment');
const MessageModel = require('../models/message.model');

const saveMessage = async ({ message, roomId, userId }) => {
	try {
		const messageData = {
			content: message,
			user: userId,
			room: roomId,
			time: moment(),
		}
		const message = MessageModel(messageData);
		await message.save();

		return message;
	} catch (error) {
		throw new Error(error.message);
	}
};

module.exports = {
	saveMessage,
}