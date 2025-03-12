const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};
