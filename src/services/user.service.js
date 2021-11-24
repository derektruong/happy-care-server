const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const User = require('../models/user.model');
const Specialization = require('../models/specialization.model');
const SpecializationService = require('../services/specialization.service');

const createUser = async ({ userFields }) => {
  try {
    const user = User(userFields);
    await user.save();
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    return { user, token };
  } catch (error) {
    throw new Error(error.message);
  }
};

const logoutUser = async ({ user }) => {
  try {
    user.token = '';
    await user.save();

    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserInfoById = async ({ userId }) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw {
        status: 404,
        message: 'user not found',
      };
    }

    return { user };
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const updateUser = async ({ user, updateFields, updateBody }) => {
  try {
    const allowedUpdate = ['email', 'password', 'profile', 'background', 'specializations'];

    let isValidOperator = updateFields.every((update) =>
      allowedUpdate.includes(update)
    );

    if (user.role !== 'doctor' && updateFields.includes('background')) {
      throw {
        status: 400,
        message: 'member cannot update background field',
      };
    }

    if (!isValidOperator) {
      throw {
        status: 400,
        message: 'you cannot update with these fields',
      };
    }

    updateFields.forEach((update) => {
      user[update] = updateBody[update];
    });

    await user.save();
    return { user };
  } catch (error) {
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const verifyUserRole = (token) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
  if (data) {
    return { 
      userId: data._id, 
      userRole: data.role,
    };
  } else {
    return null;
  }
  } catch (error) {
    logger.Error(error.message);
    return null;
  }
  
}

const getAllSpecializationsByUserId = async ({ userId }) => {
  try {
    const user = await User.findById(userId);
    const userSpecs =  user.specializations;

    const userSpecIds = await Promise.all(userSpecs.map(async (userSpec) => {
      const spec = await Specialization.findOne({ name: userSpec });
      return spec._id.toString();
    }));

    return userSpecIds;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getDoctors = async ({ specId }) => {
  try {
    let options = { role: 'doctor' };
    if (specId) {
      console.log(specId);
      const specName = await SpecializationService.getSpecNameById({ specId });
      options = {
        ...options,
        specializations: specName,
      };
    }
    const userData = await User.find(options);

    return userData;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUserInfoById,
  updateUser,
  verifyUserRole,
  getAllSpecializationsByUserId,
  getDoctors,
};
