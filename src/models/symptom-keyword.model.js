const mongoose = require('mongoose');

const options = { timestamps: true };
const symptomKeywordSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  options
);

const SymptomKeyword = mongoose.model('Symptom-Keyword', symptomKeywordSchema);

module.exports = SymptomKeyword;
