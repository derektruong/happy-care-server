const logger = require('../config/logger');
const { ERROR_MESSAGE } = require('../config/constants');
const RoomModel = require('../models/room.model');
const UserModel = require('../models/user.model');

const verifyRoom = async ({ memberId, doctorId }) => {
  try {
    const member = await UserModel.findById(memberId).lean();
    const doctor = await UserModel.findById(doctorId).lean();
    const literalName = `${member.email}, ${doctor.email}`;
    const room = await RoomModel.findOne({
      literalName: literalName,
    });

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
    throw new Error(error.message);
  }
};

const getMyRooms = async (userId) => {
  try {
    const rooms = await RoomModel.find({
      members: userId,
    })
      .populate('members', '_id profile.fullname')
      .lean();

    rooms.forEach((room) => {
      if (room.readBy.includes(userId)) {
        room.isRead = true;
      } else {
        room.isRead = false;
      }
      delete room.readBy;
      delete room.literalName;
      delete room.__v;
      delete room.updatedAt;
      delete room.createdAt;
    });
    return rooms;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMembersFromRoom = async (roomId) => {
  try {
    const room = await RoomModel.findOne({ _id: roomId })
      .populate('members', '_id profile.fullname')
      .lean();
    return room.members;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setUserReadMessage = async ({ userId, roomId }) => {
  try {
    const room = await RoomModel.findOne({ _id: roomId });
    const index = room.members.indexOf(userId);
    if (index !== -1) return;
    room.members.push(userId);
    await room.save();
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  verifyRoom,
  getMyRooms,
  getMembersFromRoom,
  setUserReadMessage,
};
