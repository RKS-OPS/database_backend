const dbService = require("../service/dbService");

const getMinistryDivisions = async () => {
  try {
    const result = await dbService.query(`
      SELECT 
        m."MJM_MINISTRY" AS ministry,
        d."MJV_DIVISION" AS division
      FROM "MST_JVN_MINISTRY" m
      JOIN "MST_JVN_DIVISION" d
        ON m."MJM_MINISTRY_ID" = d."MJV_MJM_MINISTRY_ID"
      ORDER BY ministry, division;
    `);

    const rows = result.rows;

    const grouped = rows.reduce((acc, row) => {
      const { ministry, division } = row;
      if (!acc[ministry]) {
        acc[ministry] = [];
      }
      acc[ministry].push(division);
      return acc;
    }, {});

    return grouped;
  } catch (error) {
    console.error("Error fetching ministry divisions:", error.message);
    throw error;
  }
};

const getDivisionBranches = async () => {
  const result = await dbService.query(`
    SELECT 
      d."MJV_DIVISION" AS division,
      b."MJB_BRANCH" AS branch
    FROM "MST_JVN_DIVISION" d
    JOIN "MST_JVN_BRANCH" b
      ON d."MJV_DIVISION_ID" = b."MJB_DIVISION_ID"
    ORDER BY division, branch;
  `);

  const rows = result.rows;

  const grouped = rows.reduce((acc, row) => {
    const { division, branch } = row;
    if (!acc[division]) {
      acc[division] = [];
    }
    acc[division].push(branch);
    return acc;
  }, {});

  return grouped;
};

module.exports = {
  getMinistryDivisions,
  getDivisionBranches,
};
