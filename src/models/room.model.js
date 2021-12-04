const mongoose = require('mongoose');

const options = { timestamps: true };
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    literalName: {
      type: String,
      required: true,
      immutable: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    hasMessages: {
      type: Boolean,
      default: false,
    },
  },
  options
);

// * toJSON
roomSchema.methods.toJSON = function () {
  const room = this;
  const roomObject = room.toObject();

  delete roomObject.readBy;
  delete roomObject.literalName;
  delete roomObject.__v;
  delete roomObject.updatedAt;
  delete roomObject.createdAt;

  return roomObject;
};

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
