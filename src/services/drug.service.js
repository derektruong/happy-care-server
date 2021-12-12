const { leanArray, leanObject } = require('../utils/helpers/api.helper');
const Drug = require('../models/drug.model');

const createDrug = async ({ createData, user }) => {
  try {
    // authorizate adminstrator
    if (user.role !== 'admin') {
      throw {
        status: 400,
        message: 'unauthorized for people have no adminstrator role',
      };
    }

    const keyword = Drug(createData);
    await keyword.save();

    return;
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const getAllDrugs = async () => {
  try {
    const keywords = await Drug.find({ isDeleted: false });
    return { keywords: leanArray(keywords) };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDrugById = async (id) => {
  try {
    const keyword = await Drug.findOne({ _id: id, isDeleted: false });
    return { keyword: leanObject(keyword) };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateDrugById = async (id, updateData, user) => {
  try {
    // authorizate adminstrator
    if (user.role !== 'admin') {
      throw {
        status: 400,
        message: 'unauthorized for people have no adminstrator role',
      };
    }
    await Drug.findByIdAndUpdate(id, updateData);
    return;
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const deleteDrugById = async (id, user) => {
  try {
    // authorizate adminstrator
    if (user.role !== 'admin') {
      throw {
        status: 400,
        message: 'unauthorized for people have no adminstrator role',
      };
    }
    await Drug.findByIdAndUpdate(id, { isDeleted: true });
    return;
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

module.exports = {
  createDrug,
  getAllDrugs,
  getDrugById,
  updateDrugById,
  deleteDrugById,
};
