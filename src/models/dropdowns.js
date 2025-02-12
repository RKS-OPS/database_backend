const db = require("../configs/postgres");

// Function to fetch all dropdowns
const getAllDropdowns = async (moduleId) => {
  try {
    const active = "Y";
    const query =
      'SELECT * FROM "JVN_DB_SYSTEM".func_jvn_get_dropdown_mst_data($1::integer, $2::text)';
    // cast moduleId to integer
    const values = [parseInt(moduleId, 10), active];
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllDropdowns };
