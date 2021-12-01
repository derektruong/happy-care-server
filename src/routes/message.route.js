const express = require('express');
const MessageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

const router = express.Router();

// GET
router.get('/:roomId', auth, MessageController.getAllMessages);

module.exports = router;