require('./db/mongoose');
const express = require('express');
const path = require('path');
const env = require('./config/env');
const logger = require('./config/logger');
const initRoutes = require('./routes');

const app = express();

// automatically pass incoming json to an object so we can access it in our request.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PUBLIC_PATH = path.join(__dirname, '../public');

// Serve static files from public
app.use(express.static(PUBLIC_PATH));

try {
  // register router here
  initRoutes(app);
} catch (error) {
  logger.Error(error.message);
}

module.exports = app;
