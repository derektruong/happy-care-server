const DrugService = require('../services/drug.service');
const { generateBasicResponse } = require('../utils/helpers/api.helper');

const createDrug = async (req, res) => {
  try {
    const { name, description } = req.body;
    // authorizate adminstrator
    await DrugService.createDrug({
      name,
      description,
      user: res.user,
    });

    res.json(generateBasicResponse(true, false, 'create drugs successfully'));
  } catch (error) {
    const { status, message } = error;
    if (status === 400) {
      return res.status(400).json(generateBasicResponse(false, false, message));
    }
    res.status(500).json(generateBasicResponse(false, true, message));
  }
};

const getAllDrugs = async (req, res) => {
  try {
    const rs = await DrugService.getAllDrugs();

    res.json({
      ...generateBasicResponse(true, false, 'get all drugs successfully'),
      data: rs,
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

const getDrugById = async (req, res) => {
  try {
    const { id } = req.params;
    const rs = await DrugService.getDrugById(id);

    res.json({
      ...generateBasicResponse(true, false, 'get drug successfully'),
      data: rs,
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

const updateDrugById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    await DrugService.updateDrugById(id, updateData, res.user);

    res.json(generateBasicResponse(true, false, 'updated drug successfully'));
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

const deleteDrugById = async (req, res) => {
  try {
    const { id } = req.params;
    await DrugService.deleteDrugById(id, res.user);

    res.json(generateBasicResponse(true, false, 'deleted drug successfully'));
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
};

module.exports = {
  createDrug,
  getAllDrugs,
  getDrugById,
  updateDrugById,
  deleteDrugById,
};
