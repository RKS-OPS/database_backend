const express = require("express");
const router = express.Router();
const projectRoutes = require("./projects");

router.get("/", (req, res) => {
  // #swagger.ignore = true
  res.send("Hello from the /api endpoint!");
});

// Register Routes
router.use("/projects", projectRoutes);

module.exports = router;
