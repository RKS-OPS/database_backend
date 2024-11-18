const express = require("express");
const router = express.Router();
const projectRoutes = require("./projects");
const usertRoutes = require("./users");
const planviewRoutes = require("./planviews");

router.get("/", (req, res) => {
  res.send("Hello from the /api endpoint!");
});

// Register Routes
router.use("/projects", projectRoutes);
router.use("/users", usertRoutes);
router.use("/planviews", planviewRoutes);

module.exports = router;
