const mongoose = require('mongoose');

const options = { timestamps: true };
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
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
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  options
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
