require('dotenv').config();

module.exports = {
	PORT: process.env.PORT || 3000,
	SECRET: process.env.SECRET_KEY,
	CONNECTION_STRING: process.env.CONNECTION_MONGO,
}