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
    keywords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Symptom-Keyword',
        unique: true,
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  options
);

const Specialization = mongoose.model('Specialization', specializationSchema);

module.exports = Specialization;
