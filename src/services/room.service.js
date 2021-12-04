const logger = require('../config/logger');
const RoomModel = require('../models/room.model');
const MessageModel = require('../models/message.model');
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

    await Promise.all(rooms.map(async (room) => {
      if (room.readBy.includes(userId)) {
        room.isRead = true;
      } else {
        room.isRead = false;
      }

      const messages = await MessageModel.findOne({ room: room._id, isDeleted: false });
      if (messages) {
        room.hasMessage = true;
      } else {
        room.hasMessage = false;
      }

      delete room.readBy;
      delete room.literalName;
      delete room.__v;
      delete room.updatedAt;
      delete room.createdAt;
    }));

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
    const index = room.readBy.indexOf(userId);
    if (index !== -1) return;
    room.readBy.push(userId);
    await room.save();
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setUsersReadMessage = async ({ userIds, roomId }) => {
  try {
    const room = await RoomModel.findOne({ _id: roomId });
    room.readBy = [];
    userIds.forEach((userId) => {
      room.readBy.push(userId);
    });
    await room.save();
    return;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  verifyRoom,
  getMyRooms,
  getMembersFromRoom,
  setUserReadMessage,
  setUsersReadMessage,
};
