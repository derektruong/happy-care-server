const moment = require('moment');
const MessageModel = require('../models/message.model');

const saveMessage = async ({ messageContent, roomId, userId }) => {
	try {
		const messageData = {
			content: messageContent,
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