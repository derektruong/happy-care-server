const mongoose = require('mongoose');

const options = { timestamps: true };
const specializationSchema = mongoose.Schema(
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
    keywords: {
      type: [String],
    },
  },
  options
);

const Specialization = mongoose.model('Specialization', specializationSchema);

module.exports = Specialization;
