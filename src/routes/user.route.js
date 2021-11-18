const express = require('express');
const User = require('../controllers/user.controller');
const auth = require('../middleware/auth');
// const User = require("../models/user");

const router = new express.Router();

// POST
// authentication
router.post('/', User.createUser);

router.post('/login', User.loginUser);

router.post('/logout', auth, User.logoutUser);

// GET
// router.get("/api/users", auth, User.getUsers);

router.get('/me', auth, User.getUserInfo);

router.get('/:id', User.getUserInfoById);

// PATCH
router.patch('/me', auth, User.updateUser);

// DELETE
router.delete('/me', auth, User.deleteUser);

// * exports
module.exports = router;
