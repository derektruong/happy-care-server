require("./db/mongoose");
const express = require("express");
const env = require("./config/env");
const logger = require("./config/logger");
const UserRoute = require("./routes/user.route");
const SpecialistRoute = require("./routes/specialist.route");

const app = express();
const PORT = env.PORT;

// automatically pass incoming json to an object so we can access it in our request.
app.use(express.json());

// register router here
app.use(UserRoute);
app.use(SpecialistRoute);

// Run app
app.listen(PORT, () => {
	logger.Info("🚀 Listening on port " + PORT);
});
