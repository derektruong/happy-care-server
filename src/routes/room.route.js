const express = require('express');
const RoomController = require('../controllers/room.controller');
const auth = require('../middleware/auth');

const router = express.Router();

// GET
router.post('/verify-room', auth, RoomController.verifyRoom);
router.get('/me', auth, RoomController.getMyRooms);
router.get('/:id/members', auth, RoomController.getMembersFromRoom);

module.exports = router;