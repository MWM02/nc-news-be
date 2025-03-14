const db = require("../db/connection");
const { checkIfExist } = require("../utils/utils");

exports.fetchUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};

exports.fetchUserById = async (req) => {
  const { username } = req.params;
  const sqlStr = `SELECT * FROM users WHERE username = $1`;
  const promises = [
    checkIfExist("users", "username", username),
    db.query(sqlStr, [username]),
  ];
  const results = await Promise.all(promises);
  return results[1].rows[0];
};
