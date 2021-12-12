const express = require('express');
const SymptomKeywordController = require('../controllers/symptom-keyword.controller');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST
router.post('/', auth, SymptomKeywordController.createSymptomKeyword);

// GET
router.get('/', SymptomKeywordController.getAllSymptomKeywords);

router.get('/:id', auth, SymptomKeywordController.getSymptomKeywordById);

// PATCH
router.patch('/admin/:id', auth, SymptomKeywordController.updateSymptomKeywordById);

// DELETE
router.delete('/admin/:id', auth, SymptomKeywordController.deleteSymptomKeywordById);

module.exports = router;
