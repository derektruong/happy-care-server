const Specialization = require('../models/specialization.model');

const createSpecialization = async (req, res) => {
  const specialization = Specialization(req.body);
  try {
    // authorizate adminstrator
    if (res.user.role !== 'admin') {
      return res.status(400).json({
        error: 'unauthorized for people have no adminstrator role',
      });
    }

    await specialization.save();
    res.json({ message: 'add specialization successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addSpecializationForUser = async (req, res) => {
  try {
    if (res.user.role === 'admin') {
      return res
        .status(400)
        .json({ error: "admin doesn't have this permission" });
    }

    const specializations = req.body.specialization;
    const user = res.user;

    user.specializations = [];
    for (let specialization of specializations) {
      const isExist = await Specialization.findOne({ name: specialization.name });

      if (!isExist) {
        return res.status(400).json({ error: 'this specialization is not exists' });
      }

      user.specializations = [...user.specializations, specialization.name];
    }

    await user.save();

    res.json({ message: 'add specialization successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.find({});

    res.json({ message: 'get all specializations successfully', specialization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecializationOfUser = async (req, res) => {
  try {
    if (res.user.role === 'admin') {
      return res
        .status(400)
        .json({ error: "admin doesn't have this permission" });
    }

    res.json(res.user.specializations);
  } catch (error) {
    console.log('Hello');
    res.status(500).json({ error: error.message });
  }
};

const updateSpecialization = async (req, res) => {
  try {
    // authorizate adminstrator
    if (res.user.role !== 'admin') {
      return res.status(400).json({
        error: 'unauthorized for people have no adminstrator role',
      });
    }

    // handler
    const specialization = await Specialization.findById(req.params.id);

    if (!specialization) {
      return res.status(404).json({ error: 'specialization not found' });
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
      specialization[update] = req.body[update];
    });

    await specialization.save();

    res.json({ message: 'update specialization successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSpecialization = async (req, res) => {
  try {
    // authorizate adminstrator
    if (res.user.role !== 'admin') {
      return res.status(400).json({
        error: 'unauthorized for people have no adminstrator role',
      });
    }

    // handler
    const specialization = await Specialization.findByIdAndDelete(req.params.id);

    if (!specialization) {
      return res.status(404).json({ error: 'specialization not found' });
    }

    res.json({ message: 'deleted specialization successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSpecialization,
  addSpecializationForUser,
  getAllSpecialization,
  getSpecializationOfUser,
  updateSpecialization,
  deleteSpecialization,
};
