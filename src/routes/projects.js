const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");

// Routes for /projects
router.get("/", projectsController.getAllProjects);
router.post("/", projectsController.createProject);
router.get("/searchIds", projectsController.searchProjectIds);
router.get("/:id", projectsController.getProjectById);
router.put("/:id", projectsController.updateProjectById);
router.delete("/:id", projectsController.deleteProjectById);
router.post("/:id/note", projectsController.createProjectNoteById);

module.exports = router;
