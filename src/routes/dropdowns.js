const express = require("express");
const router = express.Router();
const dropdownsController = require("../controllers/dropdownsController");

// Routes for /backend-api/dropdowns
router.get("/", dropdownsController.getAllDropdowns);

module.exports = router;
