const express = require('express');
const Specialization = require('../controllers/specialization.controller');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST
router.post('/admin/specialization', auth, Specialization.createSpecialization);

router.post('/users/me/specialization', auth, Specialization.addSpecializationForUser);

// GET
router.get('/admin/specialization', Specialization.getAllSpecializations);

router.get('/users/me/specialization', auth, Specialization.getSpecializationOfUser);

// PATCH
router.patch('/admin/specialization/:id', auth, Specialization.updateSpecialization);

// DELETE
router.delete('/admin/specialization/:id', auth, Specialization.deleteSpecialization);

module.exports = router;
