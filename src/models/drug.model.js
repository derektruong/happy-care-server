const mongoose = require('mongoose');

const options = { timestamps: true };
const drugSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  options
);

const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;