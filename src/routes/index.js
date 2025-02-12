const express = require("express");
const router = express.Router();
const projectRoutes = require("./projects");
const userRoutes = require("./users");
const locationRoutes = require("./locations");
const organizationRoutes = require("./organizations");
const dropdownsRoutes = require("./dropdowns");

router.get("/", (req, res) => {
  res.send("Hello from the /api endpoint!");
});

// Register Routes
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/locations", locationRoutes);
router.use("/organizations", organizationRoutes);
router.use("/dropdowns", dropdownsRoutes);
module.exports = router;
