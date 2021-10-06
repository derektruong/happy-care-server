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
router.get("/api/users/me", auth, User.getUserInfo);

// PATCH


// * exports
module.exports = router;