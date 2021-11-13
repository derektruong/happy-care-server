const UserService = require('../services/user.service');
const { generateBasicResponse } = require('../helpers/api.helper');

// POST
//#region auththentication
const createUser = async (req, res) => {
  try {
    const { message } = await UserService.createUser(req.body);
    res
      .status(200)
      .json(generateBasicResponse(true, false, 'user signed up successfully'));
  } catch (error) {
    res.status(400).json(generateBasicResponse(false, true, error.message));
  }
};

const loginUser = async (req, res) => {
  try {
    const { user, token } = await UserService.loginUser(
      req.body.email,
      req.body.password
    );
    res.status(200).json({
      ...generateBasicResponse(true, false, 'user logged in successfully'),
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(400).json(generateBasicResponse(false, true, error.message));
  }
};

const logoutUser = async (req, res) => {
  try {
    await UserService.logoutUser(req.user);
    res.json(
      generateBasicResponse(true, false, 'user logged out successfully')
    );
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};
//#endregion

// GET
const getUserInfo = async (req, res) => {
  try {
    res.json({
      ...generateBasicResponse(true, false, 'user was found'),
      data: res.user,
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

const getUserInfoById = async (req, res) => {
  try {
    const id = req.params.id;
    const rs = await UserService.getUserInfoById(id);

    res.json({
      ...generateBasicResponse(true, false, 'user was found'),
      data: rs,
    });
  } catch (error) {
    const { status, message } = error;
    if (status === 404) {
      return res.status(404).json(generateBasicResponse(false, false, message));
    }
    res.status(status).json(generateBasicResponse(false, true, message));
  }
};

// PATCH
const updateUser = async (req, res) => {
  try {
    const updateFields = Object.keys(req.body);
    const user = res.user;
    const rs = await UserService.updateUser(user, updateFields);

    res.json({
      ...generateBasicResponse(true, false, 'user was updated successfully'),
      data: rs,
    });
  } catch (error) {
    const { status, message } = error;
    if (status === 400) {
      return res.status(400).json(generateBasicResponse(false, false, message));
    }
    res.status(status).json(generateBasicResponse(false, true, message));
  }
};

// DELETE
const deleteUser = async (req, res) => {
  try {
    await res.user.remove();
    res.json(
      generateBasicResponse(true, false, 'user was deleted successfully')
    );
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

// * exports
module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUserInfo,
  getUserInfoById,
  updateUser,
  deleteUser,
};
