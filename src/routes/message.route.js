const express = require('express');
const MessageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

const router = express.Router();

// GET
router.get('/:roomId', auth, MessageController.getMessages);

// DELETE
router.delete('/:roomId/:messageId', auth, MessageController.deleteMessageById);

module.exports = router;