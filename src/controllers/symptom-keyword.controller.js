const SymptomKeywordService = require('../services/symptom-keyword.service');
const { generateBasicResponse } = require('../utils/helpers/api.helper');

const createSymptomKeyword = async (req, res) => {
  try {
    const { names } = req.body;
    // authorizate adminstrator
    await SymptomKeywordService.createSymptomKeyword({
      names,
      user: res.user,
    });

    res.json(
      generateBasicResponse(true, false, 'create symptom keywords successfully')
    );
  } catch (error) {
    const { status, message } = error;
    if (status === 400) {
      return res.status(400).json(generateBasicResponse(false, false, message));
    }
    res.status(500).json(generateBasicResponse(false, true, message));
  }
};

const getAllSymptomKeywords = async (req, res) => {
  try {
    const rs = await SymptomKeywordService.getAllSymptomKeywords();

    res.json({
      ...generateBasicResponse(
        true,
        false,
        'get all keyword successfully'
      ),
      data: rs,
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
}

const getSymptomKeywordById = async (req, res) => {
  try {
    const { id } = req.params;
    const rs = await SymptomKeywordService.getSymptomKeywordById(id);

    res.json({
      ...generateBasicResponse(true, false, 'get symptom keyword successfully'),
      data: rs,
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
}

const updateSymptomKeywordById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await SymptomKeywordService.updateSymptomKeywordById(
      id,
      name,
      res.user
    );

    res.json(generateBasicResponse(true, false, 'update symptom keyword successfully'));
  } catch (error) {
    const { status, message } = error;
    if (status === 400) {
      return res.status(400).json(generateBasicResponse(false, false, message));
    }
    res.status(500).json(generateBasicResponse(false, true, message))
  }
}

const deleteSymptomKeywordById = async (req, res) => {
  try {
    const { id } = req.params;
    await SymptomKeywordService.deleteSymptomKeywordById(id, req.user);

    res.json(generateBasicResponse(true, false, 'delete symptom keyword successfully'));
  } catch (error) {
    const { status, message } = error;
    if (status === 400) {
      return res.status(400).json(generateBasicResponse(false, false, message));
    }
    res.status(500).json(generateBasicResponse(false, true, message))
  }
}

module.exports = {
  createSymptomKeyword,
  getAllSymptomKeywords,
  getSymptomKeywordById,
  updateSymptomKeywordById,
  deleteSymptomKeywordById,
};
