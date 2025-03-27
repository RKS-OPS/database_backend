const dbService = require("../service/dbService");
const ASSOC_REFERENCE_FIELDS = require("./mappingFields/accosReferences");
const { tableName, projectIdField, assocReferenceNoField, userIdField } =
  ASSOC_REFERENCE_FIELDS;

// Insert multiple client contacts
const createAssocRefNums = async ({ projectId, refNos, createUserId }) => {
  try {
    if (!refNos || refNos.length === 0) {
      throw new Error("No assocReferenceNo provided.");
    }

    // Generate placeholders dynamically for PostgreSQL (e.g., ($1, $2, $3), ($4, $5, $6), ...)
    const values = [];
    const placeholders = refNos
      .map((_, index) => {
        const baseIndex = index * 3; // Each row has 3 values
        values.push(projectId, refNos[index].assocReferenceNo, createUserId);
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
      })
      .join(", ");

    const query = `
    INSERT INTO "${tableName}" ("${projectIdField}", "${assocReferenceNoField}", "${userIdField}")
    VALUES ${placeholders}
  `;

    await dbService.query(query, values);
    return;
  } catch (error) {
    console.error("Error creating assocReferenceNo:", error.message);
    throw error;
  }
};

const deleteAssocRefNumsByProjectId = async (projectId) => {
  try {
    const query = `
      DELETE FROM "${tableName}"
      WHERE "${projectIdField}" = $1
    `;

    await dbService.query(query, [projectId]);
    return;
  } catch (error) {
    console.error("Error deleting assocReferenceNo:", error.message);
    throw error;
  }
};

module.exports = { createAssocRefNums, deleteAssocRefNumsByProjectId };
