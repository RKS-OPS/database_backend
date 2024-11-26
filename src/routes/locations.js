const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationsController");

// Routes for /api/addresses
router.get("/", locationController.getAllLocations);
router.post("/", locationController.upSertLocation);

module.exports = router;
