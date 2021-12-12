const express = require('express');
const PrescriptionController = require('../controllers/prescription.controller');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST
router.post('/', auth, PrescriptionController.createPrescription);

// GET
router.get('/me', auth, PrescriptionController.getPrescriptionByMe);

// PATCH
router.patch('/:id', auth, PrescriptionController.updatePrescription);

// DELETE
router.delete('/:id', auth, PrescriptionController.deletePrescription);

module.exports = router;