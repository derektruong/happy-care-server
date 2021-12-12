const Drug = require('../models/drug.model');

const createDrug = async ({ name, description, user }) => {
  try {
    // authorizate adminstrator
    if (user.role !== 'admin') {
      throw {
        status: 400,
        message: 'unauthorized for people have no adminstrator role',
      };
    }

    const keyword = Drug({ name, description });
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
    delete keywords.__v;
    delete keywords.createdAt;
    delete keywords.updatedAt;

    return { keywords };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDrugById = async (id) => {
  try {
    const keyword = await Drug.findOne({ _id: id, isDeleted: false });
    delete keyword.__v;
    delete keyword.createdAt;
    delete keyword.updatedAt;

    return { keyword };
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
