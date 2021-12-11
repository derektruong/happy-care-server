const express = require('express');
const SpecializationController = require('../controllers/specialization.controller');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST
router.post('/admin/specialization', auth, SpecializationController.createSpecialization);

router.post('/users/me/specialization', auth, SpecializationController.addSpecializationForUser);

// GET
router.get('/admin/specialization', SpecializationController.getAllSpecializations);

router.get('/users/specialization/symptom-keyword', auth, SpecializationController.getSpecializationsBySymptomKeyword);

router.get('/users/me/specialization', auth, SpecializationController.getSpecializationOfUser);

// PATCH
router.patch('/admin/specialization/:id', auth, SpecializationController.updateSpecialization);

// DELETE
router.delete('/admin/specialization/:id', auth, SpecializationController.deleteSpecialization);

module.exports = router;
