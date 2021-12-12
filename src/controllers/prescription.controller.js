const PrescriptionService = require('../services/prescription.service');
const { generateBasicResponse } = require('../utils/helpers/api.helper');

const createPrescription = async (req, res) => {
  try {
    // authorizate adminstrator
    await PrescriptionService.createPrescription(req.body, res.user);

    res.json(
      generateBasicResponse(true, false, 'create prescription successfully')
    );
  } catch (error) {
    const { status, message } = error;
    if (status === 400) {
      return res.status(400).json(generateBasicResponse(false, false, message));
    }
    res.status(500).json(generateBasicResponse(false, true, message));
  }
};

const getPrescriptionByMe = async (req, res) => {
  try {
    const rs = await PrescriptionService.getPrescriptionByMe(req.user);

    res.json({
      ...generateBasicResponse(
        true,
        false,
        'get prescriptions by me successfully'
      ),
      data: rs,
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
}

const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const user = res.user;
    const updateFields = Object.keys(req.body);
    const updateData = req.body;

    await PrescriptionService.updatePrescription(id, updateFields, updateData, user);

    res.json(
      generateBasicResponse(true, false, 'updated prescription successfully')
    );
  } catch (error) {
    const { status, message } = error;
    res.status(status).json(generateBasicResponse(false, true, message));
  }
}

const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const user = res.user;

    await PrescriptionService.deletePrescription(id, user);

    res.json(
      generateBasicResponse(true, false, 'deleted prescription successfully')
    );
  } catch (error) {
    const { status, message } = error;
    res.status(status).json(generateBasicResponse(false, true, message));
  }
}

module.exports = {
  createPrescription,
  getPrescriptionByMe,
  updatePrescription,
  deletePrescription,
};
