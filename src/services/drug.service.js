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

    const drug = Drug(createData);
    await drug.save();

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
    const drugs = await Drug.find({ isDeleted: false });
    return { drugs: leanArray(drugs) };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDrugById = async (id) => {
  try {
    const drug = await Drug.findOne({ _id: id, isDeleted: false });
    return { drug: leanObject(drug) };
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
