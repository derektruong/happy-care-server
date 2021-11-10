const Specialist = require('../models/specialist');

const createSpecialist = async (req, res) => {
  const specialist = Specialist(req.body);
  try {
    // authorizate adminstrator
    if (res.user.role !== 'admin') {
      return res.status(400).json({
        error: 'unauthorized for people have no adminstrator role',
      });
    }

    await specialist.save();
    res.json({ message: 'add specialist successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addSpecialistForUser = async (req, res) => {
  try {
    if (res.user.role === 'admin') {
      return res
        .status(400)
        .json({ error: "admin doesn't have this permission" });
    }

    const specialists = req.body.specialist;
    const user = res.user;

    user.specialists = [];
    for (let specialist of specialists) {
      const isExist = await Specialist.findOne({ name: specialist.name });

      if (!isExist) {
        return res.status(400).json({ error: 'this specialist is not exists' });
      }

      user.specialists = [...user.specialists, specialist.name];
    }

    await user.save();

    res.json({ message: 'add specialist successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSpecialist = async (req, res) => {
  try {
    const specialist = await Specialist.find({});

    res.json({ message: 'get all specialists successfully', specialist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecialistOfUser = async (req, res) => {
  try {
    if (res.user.role === 'admin') {
      return res
        .status(400)
        .json({ error: "admin doesn't have this permission" });
    }

    res.json(res.user.specialists);
  } catch (error) {
    console.log('Hello');
    res.status(500).json({ error: error.message });
  }
};

const updateSpecialist = async (req, res) => {
  try {
    // authorizate adminstrator
    if (res.user.role !== 'admin') {
      return res.status(400).json({
        error: 'unauthorized for people have no adminstrator role',
      });
    }

    // handler
    const specialist = await Specialist.findById(req.params.id);

    if (!specialist) {
      return res.status(404).json({ error: 'specialist not found' });
    }
    const updates = Object.keys(req.body);
    const allowedUpdate = ['name', 'description'];

    const isValidOperator = updates.every((update) =>
      allowedUpdate.includes(update)
    );

    if (!isValidOperator) {
      return res
        .status(400)
        .json({ error: 'you cannot update with these fields' });
    }

    updates.forEach((update) => {
      specialist[update] = req.body[update];
    });

    await specialist.save();

    res.json({ message: 'update specialist successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSpecialist = async (req, res) => {
  try {
    // authorizate adminstrator
    if (res.user.role !== 'admin') {
      return res.status(400).json({
        error: 'unauthorized for people have no adminstrator role',
      });
    }

    // handler
    const specialist = await Specialist.findByIdAndDelete(req.params.id);

    if (!specialist) {
      return res.status(404).json({ error: 'specialist not found' });
    }

    res.json({ message: 'deleted specialist successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSpecialist,
  addSpecialistForUser,
  getAllSpecialist,
  getSpecialistOfUser,
  updateSpecialist,
  deleteSpecialist,
};
