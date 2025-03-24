const e = require("cors");
const dbService = require("../service/dbService");
const ESTIMATE_COST_FIELDS = require("./mappingFields/estimatedCost");

const { tableName, projectIdField, yearField, costField, userIdField } =
  ESTIMATE_COST_FIELDS;

// Insert multiple client contacts
const createEstimatedCosts = async ({
  projectId,
  estimatedCosts,
  createUserId,
}) => {
  try {
    if (!estimatedCosts || estimatedCosts.length === 0) {
      throw new Error("No estimated costs provided.");
    }

    // Generate placeholders dynamically for PostgreSQL (e.g., ($1, $2, $3), ($4, $5, $6), ...)
    const values = [];
    const placeholders = estimatedCosts
      .map((_, index) => {
        const baseIndex = index * 3; // Each row has 3 values
        values.push(
          projectId,
          estimatedCosts[index].year,
          estimatedCosts[index].cost,
          createUserId
        );
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${
          baseIndex + 4
        })`;
      })
      .join(", ");

    const query = `
    INSERT INTO "${tableName}" ("${projectIdField}", "${yearField}", "${costField}", "${userIdField}")
    VALUES ${placeholders}
  `;

    await dbService.query(query, values);

    return;
  } catch (error) {
    console.error("Error creating estimated costs:", error.message);
    throw error;
  }
};
module.exports = { createEstimatedCosts };
