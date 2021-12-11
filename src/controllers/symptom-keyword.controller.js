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
      generateBasicResponse(true, false, 'create keywords successfully')
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
      ...generateBasicResponse(true, false, 'get keyword successfully'),
      data: rs,
    });
  } catch (error) {
    res.status(500).json(generateBasicResponse(false, true, error.message));
  }
}

module.exports = {
  createSymptomKeyword,
  getAllSymptomKeywords,
  getSymptomKeywordById,
};
