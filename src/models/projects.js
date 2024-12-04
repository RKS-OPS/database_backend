const db = require('../configs/postgres'); // Import the database connection

// Fetch all projects from the database
const getAllProjects = async () => {
  try {
    // Call the PostgreSQL function to fetch project data
    // const test = await db.query(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'JVN_DB_SYSTEM';`)
    // console.log('test', test)
    const result = await db.query('SELECT * FROM "JVN_DB_SYSTEM"."func_jvn_get_intake_projects_data"();');
    return result.rows; // Return the rows fetched by the query
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    throw err; // Throw the error to be handled by the caller
  }
};

module.exports = {
  getAllProjects,
};
