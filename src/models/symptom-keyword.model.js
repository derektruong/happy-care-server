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
  },
  options
);

const SymptomKeyword = mongoose.model('Keyword', symptomKeywordSchema);

module.exports = SymptomKeyword;
