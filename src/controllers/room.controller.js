const RoomService = require('../services/room.service');
const { generateBasicResponse } = require('../utils/helpers/api.helper');

const verifyRoom = async (req, res) => {
  try {
    const { memberId, doctorId } = req.body;
    const roomId = await RoomService.verifyRoom({ memberId, doctorId });

    res.status(200).json({
      ...generateBasicResponse(true, false, 'verify room successfully'),
      data: {
        roomId,
      },
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

const getMyRooms = async (req, res) => {
  try {
    const userId = res.user._id;

    const rooms = await RoomService.getMyRooms(userId);
    res.status(200).json({
      ...generateBasicResponse(true, false, 'get rooms successfully'),
      data: {
        rooms,
      },
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

const getMembersFromRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const members = await RoomService.getMembersFromRoom(roomId);
    res.status(200).json({
      ...generateBasicResponse(true, false, 'get members successfully'),
      data: {
        members,
      },
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
}

module.exports = {
  getMyRooms,
  verifyRoom,
  getMembersFromRoom,
};
