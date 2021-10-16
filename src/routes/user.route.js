const express = require("express");
const User = require("../controllers/user.controller");
const auth = require("../middleware/auth");
// const User = require("../models/user");

const router = new express.Router();

// POST
router.post("/api/users", User.createUser);

router.post("/api/users/login", User.loginUser);

router.post("/api/users/logout", auth, User.logoutUser);

// GET
// router.get("/api/users", auth, User.getUsers);

router.get("/api/users/me", auth, User.getUserInfo);

router.get("/api/users/:id", User.getUserInfoById);

// PATCH
router.patch("/api/users/me", auth, User.updateUser);

// DELETE
router.delete("/api/users/me", auth, User.deleteUser);


// * exports
module.exports = router;