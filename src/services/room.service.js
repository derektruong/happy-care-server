const logger = require('../config/logger');
const { ERROR_MESSAGE } = require('../config/constants');
const RoomModel = require('../models/room.model');

const verifyRoom = async ({ literalName, memberId, doctorId }) => {
  try {
    const room = await RoomModel.findOne({
      literalName: literalName,
    }).lean();

	if (!room) {
		const newRoom = RoomModel({
			name: literalName,
			literalName,
			members: [memberId, doctorId],
		});
		const savedRoom = await newRoom.save();
		return savedRoom._id;
	} else {
		return room._id;
	}
  } catch (error) {
	logger.Error(error.message);
	return ERROR_MESSAGE.cannotVerifyRoom;
  }
};

module.exports = {
	verifyRoom,
};