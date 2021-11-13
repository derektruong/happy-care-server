const express = require('express');
const Specialization = require('../controllers/specialization.controller');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST
router.post('/api/admin/specialization', auth, Specialization.createSpecialization);

router.post('/api/users/me/specialization', auth, Specialization.addSpecializationForUser);

// GET
router.get('/api/admin/specialization', Specialization.getAllSpecialization);

router.get('/api/users/me/specialization', auth, Specialization.getSpecializationOfUser);

// PATCH
router.patch('/api/admin/specialization/:id', auth, Specialization.updateSpecialization);

// DELETE
router.delete('/api/admin/specialization/:id', auth, Specialization.deleteSpecialization);

module.exports = router;
