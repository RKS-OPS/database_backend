const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationsController");

// Routes for /api/organizations
router.get("/", organizationController.getAllOrganizations);

module.exports = router;
