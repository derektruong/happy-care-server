const SymptomKeyword = require('../models/symptom-keyword.model');

const createSymptomKeyword = async ({ names, user }) => {
  try {
    // authorizate adminstrator
    if (user.role !== 'admin') {
      throw {
        status: 400,
        message: 'unauthorized for people have no adminstrator role',
      };
    }

    names.forEach(async (name) => {
      const keyword = SymptomKeyword({ name });
      await keyword.save();
    });

    return;
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const getAllSymptomKeywords = async () => {
  try {
    const keywords = await SymptomKeyword.find({});

    return { keywords };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createSymptomKeyword,
  getAllSymptomKeywords,
};
