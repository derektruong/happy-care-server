require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET: process.env.JWT_SECRET,
  CONNECTION_STRING: process.env.MONGODB_URL,
};
