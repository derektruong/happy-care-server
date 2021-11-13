require('./db/mongoose');
const express = require('express');
const env = require('./config/env');
const logger = require('./config/logger');
const initRoutes = require('./routes');

const app = express();

// automatically pass incoming json to an object so we can access it in our request.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
	// register router here
	initRoutes(app);
} catch (error) {
	logger.Error(error.message);
}



module.exports = app;
