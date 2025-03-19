const db = require("../configs/postgres");
const PROJECT_FIELDS = require("./mappingFields/project");

// Fetch all projects from the database

const getAllProjects = async ({
  id,
  status,
  startDate,
  endDate,
  page = 1,
  limit = 10,
} = {}) => {
  try {
    // Validate pagination
    page = Math.max(1, page); // Ensure page is at least 1
    limit = Math.min(Math.max(1, limit), 100); // Ensure limit is between 1 and 100

    // Base query for getting filtered results
    let baseQuery = `FROM "JVN_DB_SYSTEM"."TBL_INTAKE_PROJECT_DATA" WHERE 1=1`;
    let queryParams = [];
    let paramIndex = 1;

    // Apply Filters Dynamically
    if (id) {
      baseQuery += ` AND "JPI_Project_ID" ILIKE $${paramIndex++}`;
      queryParams.push(`%${id}%`); // Partial match
    }

    if (status) {
      baseQuery += ` AND "JPI_Intake_From_Status" = $${paramIndex++}`;
      queryParams.push(status);
    }

    if (startDate) {
      baseQuery += ` AND "JPI_Trans_Insert_TS" >= $${paramIndex++}`;
      queryParams.push(startDate);
    }

    if (endDate) {
      baseQuery += ` AND "JPI_Requested_Completion_Date" <= $${paramIndex++}`;
      queryParams.push(endDate);
    }

    // Query for total count
    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await db.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count, 10); // Convert to integer

    // Query for paginated data
    const dataQuery = `SELECT * ${baseQuery} ORDER BY "JPI_TRANS_ID" DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    queryParams.push(limit, (page - 1) * limit);
    const result = await db.query(dataQuery, queryParams);

    return {
      projects: result.rows,
      totalCount, // Include total count in response
    };
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    throw err; // Throw the error to be handled by the caller
  }
};

module.exports = { getAllProjects };

const searchProjectIds = async (id) => {
  try {
    const query = `
      SELECT "JPI_Project_ID" 
      FROM "JVN_DB_SYSTEM"."TBL_INTAKE_PROJECT_DATA"
      WHERE "JPI_Project_ID" ILIKE $1
    `;

    const values = [`%${id}%`]; // Using % for partial match

    const result = await db.query(query, values);

    return result.rows.map((row) => row.JPI_Project_ID); // Return array of IDs
  } catch (err) {
    console.error("Error fetching project IDs:", err.message);
    throw err;
  }
};

const createProject = async (newProject) => {
  try {
    // Project Table
    // Get only valid fields from newProject
    const keys = Object.keys(newProject).filter(
      (key) => newProject[key] !== undefined && newProject[key] !== null
    );
    if (keys.length === 0) throw new Error("No valid fields provided");
    console.log(keys);
    // Convert JS object keys to DB column names
    const columns = keys.map((key) => `"${PROJECT_FIELDS[key]}"`).join(", ");
    const values = keys.map((_, index) => `$${index + 1}`).join(", ");
    const queryValues = keys.map((key) => newProject[key]);
    // Insert the new project into the projects table
    const projectQuery = `
      INSERT INTO "TBL_INTAKE_PROJECT_DATA" (${columns})
      VALUES (${values})
      RETURNING *;
    `;

    console.log("projectQuery", projectQuery);

    const result = await db.query(projectQuery, queryValues);
    console.log(result.rows[0]);

    // client contacts table

    // reference no table

    // noteLog table

    // rooms table

    // Estimated Cost/Fiscal Year

    return result.rows[0]; // Return the newly created project
  } catch (err) {
    console.error("Error creating project:", err.message);
    throw err;
  }
};

module.exports = {
  getAllProjects,
  searchProjectIds,
  createProject,
};
