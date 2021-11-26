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
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  options
);

const Room = mongoose.model('Message', roomSchema);
module.exports = Room;
