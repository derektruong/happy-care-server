const SpecializationService = require('../services/specialization.service');
const { generateBasicResponse } = require('../utils/helpers/api.helper');

const createSpecialization = async (req, res) => {
  try {
    const specialization = req.body;
    // authorizate adminstrator
    await SpecializationService.createSpecialization({
      user: res.user,
      createBody: specialization,
    });

    res.json(
      generateBasicResponse(true, false, 'create specialization successfully')
    );
  } catch (error) {
    const { status, message } = error;
    if (status === 400) {
      return res.status(400).json(generateBasicResponse(false, false, message));
    }
    res.status(500).json(generateBasicResponse(false, true, message));
  }
};

const addSpecializationForUser = async (req, res) => {
  try {
    await SpecializationService.addSpecializationForUser({
      user: res.user,
      specializations: req.body.specialization,
    });

    res.json(
      generateBasicResponse(
        true,
        false,
        'add specialization for user successfully'
      )
    );
  } catch (error) {
    const { status, message } = error;
    if (status === 400) {
      return res.status(400).json(generateBasicResponse(false, false, message));
    }
    res.status(500).json(generateBasicResponse(false, true, message));
  }
};

const getAllSpecialization = async (req, res) => {
  try {
    const rs = await SpecializationService.getAllSpecialization();

    res.json({
      ...generateBasicResponse(
        true,
        false,
        'get all specialization successfully'
      ),
      data: rs,
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

const getSpecializationOfUser = async (req, res) => {
  try {
    if (res.user.role === 'admin') {
      return res
        .status(400)
        .json(
          generateBasicResponse(
            false,
            false,
            "admin doesn't have this permission"
          )
        );
    }

    res.json({
      ...generateBasicResponse(
        true,
        false,
        'get specialization of user successfully'
      ),
      data: { specializations: res.user.specializations },
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

const updateSpecialization = async (req, res) => {
  try {
    await SpecializationService.updateSpecialization({
      user: res.user,
      updateFields: Object.keys(req.body),
      updateBody: req.body,
      specializationId: req.params.id,
    });

    res.json(generateBasicResponse(true, false, 'update specialization successfully'));
  } catch (error) {
    const { status, message } = error;
    res.status(status).json(generateBasicResponse(false, true, message));
  }
};

const deleteSpecialization = async (req, res) => {
  try {
    await SpecializationService.deleteSpecialization({user: res.user, specializationId: req.params.id});

    res.json(generateBasicResponse(true, false, 'delete specialization successfully'));
  } catch (error) {
    const { status, message } = error;
    res.status(status).json(generateBasicResponse(false, true, message));
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
