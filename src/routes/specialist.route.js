const express = require("express");
const Specialist = require("../controllers/specialist.controller");

const router = new express.Router();

// POST
router.post("/api/admin/specialist", Specialist.createSpecialist);

// GET
router.get("/api/admin/specialist", Specialist.getSpecialist);

// PATCH
router.patch("/api/admin/specialist/:id", Specialist.updateSpecialist);

// DELETE
router.delete("/api/admin/specialist/:id", Specialist.deleteSpecialist);

module.exports = router;