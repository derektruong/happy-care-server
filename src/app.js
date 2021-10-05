require("./db/mongoose");
const express = require("express");
const env = require("./config/env");

const app = express();
const PORT = env.PORT;

// automatically pass incoming json to an object so we can access it in our request.
app.use(express.json());

// register router here

// Run app
app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
