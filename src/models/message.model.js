const mongoose = require('mongoose');

const options = { timestamps: true };
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: 'text',
      trim: true,
    },
    time: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  options
);

// * toJSON
messageSchema.methods.toJSON = function () {
  const message = this;
  const messageObject = message.toObject();

  delete messageObject.updatedAt;
  delete messageObject.createdAt;
  delete messageObject.__v;

  return messageObject;
};

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
