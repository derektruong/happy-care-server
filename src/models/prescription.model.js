const mongoose = require('mongoose');

const options = { timestamps: true };
const prescriptionSchema = mongoose.Schema(
  {
    diagnose: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    drugs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drug',
      }
    ],
  },
  options
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;