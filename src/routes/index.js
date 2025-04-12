const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const projectRoutes = require("./projects");
const userRoutes = require("./users");
const locationRoutes = require("./locations");
const organizationRoutes = require("./organizations");
const dropdownsRoutes = require("./dropdowns");
const projectsController = require("../controllers/projectsController"); //Added by raj April 12 2025

router.get("/", (req, res) => {
  res.send("Hello from the /api endpoint!");
});

// Register Routes
router.use("/projects/searchIds", projectsController.searchProjectIds); //Added by raj April 12 2025
router.use("/projects", authenticateToken, projectRoutes);
router.use("/users", userRoutes);
router.use("/locations", locationRoutes);
router.use("/organizations", organizationRoutes);
router.use("/dropdowns", dropdownsRoutes);
module.exports = router;
