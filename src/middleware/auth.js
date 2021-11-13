const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const env = require('../config/env');

// Check if token valid and expired
const expiredTokenHandle = async (res, token) => {
  const decodePayload = jwt.decode(token, { complete: true }).payload;

  const user = await User.findOne({
    _id: decodePayload._id,
    'tokens.token': token,
  });

  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  user.token = '';

  await user.save();
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = jwt.verify(token, env.SECRET);

    const user = await User.findById(decode._id);

    if (!user) {
      throw new Error('user not found');
    }
    res.user = user;
    res.token = token;

    next();
  } catch (error) {
    if (error.message === 'jwt expired') {
      const token = req.header('Authorization').replace('Bearer ', '');
      await expiredTokenHandle(res, token);
      return res.status(401).json({ error: 'jwt token expired' });
    }

    res.status(401).json({ error: 'unauthorized' });
    // res.status(401).json({ error: error.message });
  }
};

module.exports = auth;
