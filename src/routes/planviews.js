const express = require("express");
const router = express.Router();
const planviewsController = require("../controllers/planviewsController");

// Routes for /api/planviews
router.get("/", planviewsController.getAllPlanviews);

module.exports = router;
