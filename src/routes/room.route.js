const express = require('express');
const RoomController = require('../controllers/room.controller');
const auth = require('../middleware/auth');

const router = express.Router();

// POST
router.post('/verify-room', auth, RoomController.verifyRoom);

// GET
router.get('/me', auth, RoomController.getMyRooms);

router.get('/:id/members', auth, RoomController.getMembersFromRoom);

// PATCH

module.exports = router;