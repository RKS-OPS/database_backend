const { getAllProjects } = require("../models/projects");

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await getAllProjects(); // Call the model function
    const data = projects.map((p) => {
      return {
        id: p.out_jpd_id.toString(),
        name: p.out_jpd_name,
        description: p?.out_jpd_description,
        status: p.out_jpd_current_project_status,
      };
    });
    // console.log('data', data);
    res.json(data); // Send the fetched data as JSON
  } catch (err) {
    console.error("Error in getAllProjects controller:", err.message);
    res.status(500).send("Failed to fetch projects"); // Send error response
  }
  // res.send("List of all projects from the controller");
};

// Create a new project
exports.createProject = (req, res) => {
  const newProject = req.body;
  // Simulate adding a new project to the database
  res.status(201).send(`Project created: ${JSON.stringify(newProject)}`);
};

// Get a project by ID
exports.getProjectById = (req, res) => {
  const projectId = req.params.id;
  // Simulate fetching a project by ID from the database
  res.send(`Details of project with ID: ${projectId}`);
};

// Update a project by ID
exports.updateProjectById = (req, res) => {
  const projectId = req.params.id;
  const updatedProject = req.body;
  // Simulate updating a project in the database
  res.send(
    `Project with ID: ${projectId} updated with data: ${JSON.stringify(
      updatedProject
    )}`
  );
};

// Delete a project by ID
exports.deleteProjectById = (req, res) => {
  const projectId = req.params.id;
  // Simulate deleting a project from the database
  res.send(`Project with ID: ${projectId} deleted`);
};
