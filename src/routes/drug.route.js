const express = require('express');
const DrugController = require('../controllers/drug.controller');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST
router.post('/admin', auth, DrugController.createDrug);

// GET
router.get('/', DrugController.getAllDrugs);

router.get('/:id', auth, DrugController.getDrugById);

// PATCH
router.patch('/admin/:id', auth, DrugController.updateDrugById);

// DELETE
router.delete('/admin/:id', auth, DrugController.deleteDrugById);

module.exports = router;