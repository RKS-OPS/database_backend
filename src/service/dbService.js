const db = require("../configs/postgres");

class DBService {
  constructor() {
    this.transactionClient = null; // Stores transaction client
  }

  async query(text, params) {
    if (this.transactionClient) {
      return this.transactionClient.query(text, params); // Use transaction client if exists
    }
    return db.pool.query(text, params); // Otherwise, use normal pool
  }

  async transaction(callback) {
    const client = await db.pool.connect();
    this.transactionClient = client; // Set transaction client
    try {
      await client.query("BEGIN");
      const result = await callback(this); // Pass DBService instance with transaction
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      this.transactionClient = null; // Reset transaction client
      client.release();
    }
  }
}

module.exports = new DBService();
