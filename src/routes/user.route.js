const express = require('express');
const UserController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
// const User = require("../models/user");

const router = new express.Router();

// POST
// authentication
router.post('/', UserController.createUser);

router.post('/login', UserController.loginUser);

router.post('/logout', auth, UserController.logoutUser);

// GET
router.get('/get-doctors', auth, UserController.getDoctors);

router.get('/me', auth, UserController.getUserInfo);

router.get('/:id', UserController.getUserInfoById);

// PATCH
router.patch('/me', auth, UserController.updateUser);

// DELETE
router.delete('/me', auth, UserController.deleteUser);

// * exports
module.exports = router;
