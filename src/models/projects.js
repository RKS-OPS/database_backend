const db = require("../configs/postgres"); // Import the database connection

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
      baseQuery += ` AND "JPI_Project_Status" = $${paramIndex++}`;
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

module.exports = {
  getAllProjects,
  searchProjectIds,
};
