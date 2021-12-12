const mongoose = require('mongoose');

const options = { timestamps: true };
const prescriptionSchema = mongoose.Schema(
  {
    diagnose: {
      type: String,
      required: true,
      trim: true,
    },
    medicines: [
      {
        drug: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Drug',
        },
        dosage: {
          type: String,
          trim: true,
        },
      }
    ],
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
    },
    note: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  options
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;