const db = require("../configs/postgres");

const getAllUsers = async () => {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
};

module.exports = {
  getAllUsers,
};
