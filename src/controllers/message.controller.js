const MessageService = require('../services/message.service');
const { generateBasicResponse } = require('../utils/helpers/api.helper');

const getAllMessages = async (req, res) => {
  try {
    const messages = await MessageService.getAllMessages();
    return generateBasicResponse(res, 200, messages);
  } catch (error) {
    return generateBasicResponse(res, 500, error);
  }
};

module.exports = {
  getAllMessages,
};
