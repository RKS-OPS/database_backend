const dbService = require("../service/dbService");
const NOTE_LOG_FIELDS = require("./mappingFields/noteLogs");
const { tableName, projectId, notes, userId, fileUrl } = NOTE_LOG_FIELDS;

// Insert multiple client contacts
const createNoteLog = async ({
  projectIdValue,
  notesData,
  createUserId,
  fileUrlStr,
}) => {
  try {
  } catch (error) {
    console.error("Error creating note log:", error.message);
    throw error;
  }
};
module.exports = { createNoteLog };
