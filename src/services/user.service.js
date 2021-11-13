const User = require('../models/user.model');

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
    const allowedUpdate = ['email', 'password', 'profile', 'background'];

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

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUserInfoById,
  updateUser,
};
