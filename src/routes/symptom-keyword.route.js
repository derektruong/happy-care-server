const express = require('express');
const SymptomKeyword = require('../controllers/symptom-keyword.controller');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST
router.post('/', auth, SymptomKeyword.createSymptomKeyword);

// GET
router.get('/', SymptomKeyword.getAllSymptomKeywords);

router.get('/:id', auth, SymptomKeyword.getSymptomKeywordById);

// PATCH
// router.patch('/admin/keyword/:id', auth, SymptomKeyword.updateKeyword);

// DELETE
// router.delete('/admin/keyword/:id', auth, SymptomKeyword.deleteKeyword);

module.exports = router;
