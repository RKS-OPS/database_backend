const {
  getAllProjects,
  searchProjectIds,
  createProject,
  getProjectById,
  updateProjectById,
} = require("../models/projects");
const {
  createClientContacts,
  deleteClientContactsByProjectId,
} = require("../models/clientContacts");
const {
  createAssocRefNums,
  deleteAssocRefNumsByProjectId,
} = require("../models/accosReferences");
const {
  createEstimatedCosts,
  deleteEsimateCostsByProjectId,
} = require("../models/estimatedCosts");
const dbService = require("../service/dbService");
const PROJECT_FIELDS = require("../models/mappingFields/project");

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    let { id, status, startDate, endDate, page, limit } = req.query || {};

    // because there are special characters in the status query param
    if (status) {
      status = decodeURIComponent(status);
    }

    const data = await getAllProjects({
      id,
      status,
      startDate,
      endDate,
      page,
      limit,
    });

    const mappedProjects = data.projects.map((p) => {
      return {
        projectId: p.JPI_Project_ID.toString(),
        projectName: p.JPI_Project_Name,
        waitingOn: p.JPI_Waiting_on_Contact,
        waitingFor: p.JPI_Waiting_For,
        status: p.JPI_Status,
        priority: p.JPI_Priority,
        intakeFormStatus: p.JPI_Intake_From_Status,
        onOpsList: p.JPI_On_Opp_List,
        lastComm: p.JPI_Last_Comm_date,
        projectSponsor: p.JPI_Project_Sponsor,
        dateAdded: p.JPI_Trans_Insert_TS,
        implemented: p.JPI_Implemented,
      };
    });

    res.json({
      projects: mappedProjects,
      totalCount: data.totalCount,
    });
  } catch (err) {
    console.log(err);
    console.error("Error in getAllProjects controller:", err.message);
    res.status(500).send("Failed to fetch projects"); // Send error response
  }
};

exports.createProject = async (req, res) => {
  try {
    const newProjectData = req.body;

    console.log("req body", req.body);

    // Projects table
    const createdProject = await dbService.transaction(async () => {
      const project = await createProject(newProjectData);
      if (newProjectData.clientContacts?.length) {
        // Client contacts table
        await createClientContacts({
          projectIdValue: project.JPI_Project_ID,
          clientContacts: newProjectData.clientContacts,
          createUserId: req.user.id,
        });
      }

      if (newProjectData.assocReferenceNos?.length) {
        // Assoc reference number table
        await createAssocRefNums({
          projectId: project.JPI_Project_ID,
          refNos: newProjectData.assocReferenceNos,
          createUserId: req.user.id,
        });
      }
      // TODO: Logic to be confirmed
      // rooms table
      // if (newProjectData.rooms?.length) {
      //   await createProjectRooms({
      //     projectIdValue: project.JPI_Project_ID,
      //     rooms: newProjectData.rooms,
      //     createUserId: req.user.id,
      //   });
      // }

      // Estimated Cost/Fiscal Year table
      if (newProjectData.estimatedCosts?.length) {
        await createEstimatedCosts({
          projectId: project.JPI_Project_ID,
          estimatedCosts: newProjectData.estimatedCosts,
          createUserId: req.user.id,
        });
      }

      return {
        id: project.JPI_TRANS_ID,
        projectId: project.JPI_Project_ID,
      };
    });
    res.json({
      id: createdProject.id,
      projectId: createdProject.projectId,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Failed to create project");
  }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
  const projectId = req.params.id;
  const rawData = await getProjectById(projectId);

  if (!rawData || !rawData.project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const mappedProject = mapProjectData(rawData);

  res.send(mappedProject);
};

// Update a project by ID
exports.updateProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const updatedProject = req.body;

    const rooms = updatedProject.rooms;
    const noteLogs = updatedProject.noteLogs;
    const clientContacts = updatedProject.clientContacts;
    const assocReferenceNos = updatedProject.assocReferenceNos;
    const estimatedCosts = updatedProject.estimatedCosts;

    await dbService.transaction(async () => {
      // Update the project
      await updateProjectById(projectId, updatedProject);

      // Update the client contacts
      if (clientContacts) {
        // delete all client contacts
        await deleteClientContactsByProjectId(projectId);
        // create new client contacts
        if (clientContacts.length > 0) {
          await createClientContacts({
            projectIdValue: projectId,
            clientContacts,
            createUserId: req.user.id,
          });
        }
      }

      // Update the assoc reference numbers
      if (assocReferenceNos) {
        // delete all assoc reference numbers
        await deleteAssocRefNumsByProjectId(projectId);
        // create new assoc reference numbers
        if (assocReferenceNos.length > 0) {
          await createAssocRefNums({
            projectId,
            refNos: assocReferenceNos,
            createUserId: req.user.id,
          });
        }
      }

      // Update the estimated costs
      if (estimatedCosts) {
        // delete all estimated costs
        await deleteEsimateCostsByProjectId(projectId);
        // create new estimated costs
        if (estimatedCosts.length > 0) {
          await createEstimatedCosts({
            projectId,
            estimatedCosts,
            createUserId: req.user.id,
          });
        }

        // TODO
        // Update the rooms
        // Update the note logs
      }
    });

    res.send("Project updated successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Failed to update project");
  }
};

// Get a list of partial match project IDs
exports.searchProjectIds = async (req, res) => {
  let { id } = req.query;
  let result = await searchProjectIds(id);
  res.send(result);
};

// Delete a project by ID
exports.deleteProjectById = (req, res) => {
  const projectId = req.params.id;
  // Simulate deleting a project from the database
  res.send(`Project with ID: ${projectId} deleted`);
};

// Create a note for a project by ID
exports.createProjectNoteById = (req, res) => {
  const projectId = req.params.id;
  const newNote = req.body;
  // Simulate adding a note to a project in the database
  res.send(
    `Note added to project with ID: ${projectId}: ${JSON.stringify(newNote)}`
  );
};

/*Local Helper Functions*/
const mapProjectData = (data) => {
  const {
    project,
    rooms,
    noteLogs,
    clientContacts,
    assocReferenceNos,
    estimatedCosts,
  } = data;
  // Pull all flat fields using PROJECT_FIELDS
  const mapped = Object.entries(PROJECT_FIELDS).reduce(
    (acc, [key, dbField]) => {
      acc[key] = project[dbField] ?? null;
      return acc;
    },
    {}
  );
  // Add the custom/nested fields
  mapped.assignedTo =
    project.assignedTo && Object.keys(project.assignedTo).length > 0
      ? project.assignedTo
      : null;
  mapped.location =
    project.location && Object.keys(project.location).length > 0
      ? project.location
      : null;
  mapped.clientContacts = clientContacts ?? [];
  mapped.rooms = rooms ?? [];
  mapped.noteLogs = noteLogs ?? [];
  mapped.assocReferenceNos = assocReferenceNos ?? [];
  mapped.estimatedCosts = estimatedCosts ?? [];

  return mapped;
};
