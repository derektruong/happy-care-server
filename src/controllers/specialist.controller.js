const Specialist = require("../models/specialist");

const createSpecialist = async (req, res) => {
	const specialist = Specialist(req.body);
	try {
		await specialist.save();

		res.json({message: "add specialist successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

const getSpecialist = async (req, res) => {
	try {
		const specialist = await Specialist.find({});
		res.json({message: "get all specialists successfully", specialist});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

const updateSpecialist = async (req, res) => {
	try {
		const specialist = await Specialist.findById(req.params.id);

		if(!specialist) {
			return res.status(404).json({ error: "specialist not found"});
		}
		const updates = Object.keys(req.body);
		const allowedUpdate = ["name", "description"];

		const isValidOperator = updates.every(update => allowedUpdate.includes(update));

		if(!isValidOperator) {
			return res.status(400).json({ error: "you cannot update with these fields" });
		}

		updates.forEach(update => {
			specialist[update] = req.body[update];
		});

		await specialist.save();

		res.json({message: "update specialist successfully"});
	} catch(error) {
		res.status(500).json({error: error.message});
	}
};

const deleteSpecialist = async (req, res) => {
	try {
		const specialist = await Specialist.findByIdAndDelete(req.params.id);

		if(!specialist) {
			return res.status(404).json({ error: "specialist not found"});
		}

		res.json({message: "deleted specialist successfully"});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

module.exports = {
	createSpecialist,
	getSpecialist,
	updateSpecialist,
	deleteSpecialist,
};