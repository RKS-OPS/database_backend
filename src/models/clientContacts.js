const dbService = require("../service/dbService");
const CLIENT_CONTACT_FIELDS = require("./mappingFields/clientContact");

const { tableName, projectId, clientContactId, userId } = CLIENT_CONTACT_FIELDS;

// Insert multiple client contacts
const createClientContacts = async ({
  projectIdValue,
  clientContacts,
  createUserId,
}) => {
  try {
    if (!clientContacts || clientContacts.length === 0) {
      throw new Error("No client contacts provided.");
    }

    // Generate placeholders dynamically for PostgreSQL (e.g., ($1, $2, $3), ($4, $5, $6), ...)
    const values = [];
    const placeholders = clientContacts
      .map((_, index) => {
        const baseIndex = index * 3; // Each row has 3 values
        values.push(projectIdValue, clientContacts[index].id, createUserId);
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
      })
      .join(", ");

    const query = `
    INSERT INTO "${tableName}" ("${projectId}", "${clientContactId}", "${userId}")
    VALUES ${placeholders}
  `;

    await dbService.query(query, values);

    return;
  } catch (error) {
    console.error("Error creating client contacts:", error.message);
    throw error;
  }
};

const deleteClientContactsByProjectId = async (projectIdValue) => {
  try {
    const query = `
      DELETE FROM "${tableName}"
      WHERE "${projectId}" = $1
    `;

    await dbService.query(query, [projectIdValue]);

    return;
  } catch (error) {
    console.error("Error deleting client contacts:", error.message);
    throw error;
  }
};

module.exports = { createClientContacts, deleteClientContactsByProjectId };
