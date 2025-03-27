const db = require("../configs/postgres");

const getAllUsers = async () => {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
};

const updateUserAzureInfo = async (email, azureId, image) => {
  try {
    const user = await db.query(
      `SELECT * FROM "MST_JVN_USER_DETAILS" WHERE "MUD_USER_EMAIL" = $1`,
      [email]
    );

    let imageBuffer = null;
    if (image) {
      const base64Data = image.split(",")[1]; // Remove Base64 metadata
      if (base64Data) {
        imageBuffer = Buffer.from(base64Data, "base64");
      }
    }

    if (user.rows.length === 0) {
      // Insert new record with schema name
      await db.query(
        `INSERT INTO "MST_JVN_USER_DETAILS" 
         ("MUD_USER_EMAIL", "MUD_AZURE_ID", "MUD_IMAGE") 
         VALUES ($1, $2, $3)`,
        [email, azureId, imageBuffer]
      );
    } else {
      if (imageBuffer !== null) {
        // Update both Azure ID and image
        await db.query(
          `UPDATE "MST_JVN_USER_DETAILS" 
           SET "MUD_AZURE_ID" = $1, "MUD_IMAGE" = $2 
           WHERE "MUD_USER_EMAIL" = $3`,
          [azureId, imageBuffer, email]
        );
      } else {
        // Update only Azure ID if image is missing
        await db.query(
          `UPDATE "MST_JVN_USER_DETAILS" 
           SET "MUD_AZURE_ID" = $1 
           WHERE "MUD_USER_EMAIL" = $2`,
          [azureId, email]
        );
      }
    }

    return;
  } catch (error) {
    console.error("Error updating user Azure info:", error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT * FROM "MST_JVN_USER_DETAILS" WHERE "MUD_USER_EMAIL" = $1`,
    [email]
  );
  return result.rows[0];
};

const searchUsersByNamePrefix = async (prefix) => {
  try {
    const result = await db.query(
      `SELECT "MUD_USER_ID" AS id, "MUD_USER_NAME" AS name,
       "MUD_IMAGE" AS image
       FROM "MST_JVN_USER_DETAILS"
       WHERE LOWER("MUD_USER_NAME") LIKE LOWER($1)
       ORDER BY "MUD_USER_NAME"
       LIMIT 10`,
      [prefix + "%"]
    );
    let data = result.rows.map((row) => {
      // convert image buffer to base64 string
      if (row.image && Buffer.isBuffer(row.image)) {
        row.image = `data:image/png;base64,${row.image.toString("base64")}`;
      }
      return row;
    });
    return data;
  } catch (error) {
    console.error("Error in searchUsersByNamePrefix model:", error.message);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  updateUserAzureInfo,
  getUserByEmail,
  searchUsersByNamePrefix,
};
