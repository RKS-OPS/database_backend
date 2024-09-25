const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");

// Routes for /api/projects
router.get(
  "/",
  /* 	#swagger.tags = ['Projects']
        #swagger.description = Get all projects list' */
  projectsController.getAllProjects
);
router.post("/", projectsController.createProject);
router.get("/:id", projectsController.getProjectById);
router.put("/:id", projectsController.updateProjectById);
router.delete("/:id", projectsController.deleteProjectById);

module.exports = router;
