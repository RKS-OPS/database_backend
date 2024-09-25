const express = require("express");
const router = express.Router();
const projectRoutes = require("./projects");
const usertRoutes = require("./users");

router.get("/", (req, res) => {
  res.send("Hello from the /api endpoint!");
});

// Register Routes
router.use("/projects", projectRoutes);
router.use("/users", usertRoutes);

module.exports = router;
