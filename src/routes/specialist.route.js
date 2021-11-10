const express = require('express');
const Specialist = require('../controllers/specialist.controller');
const auth = require('../middleware/auth');

const router = new express.Router();

// POST
router.post('/api/admin/specialist', auth, Specialist.createSpecialist);

router.post('/api/users/me/specialist', auth, Specialist.addSpecialistForUser);

// GET
router.get('/api/admin/specialist', Specialist.getAllSpecialist);

router.get('/api/users/me/specialist', auth, Specialist.getSpecialistOfUser);

// PATCH
router.patch('/api/admin/specialist/:id', auth, Specialist.updateSpecialist);

// DELETE
router.delete('/api/admin/specialist/:id', auth, Specialist.deleteSpecialist);

module.exports = router;
