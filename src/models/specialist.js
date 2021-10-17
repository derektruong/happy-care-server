const mongoose = require("mongoose");

const options = {timestamps: true};
const specialistSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	}
}, options);

const Specialist = mongoose.model("Specialist", specialistSchema);

module.exports = Specialist;