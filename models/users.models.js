const db = require("../db/connection");
const { checkIfExist } = require("../utils/utils");

exports.fetchUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};

exports.fetchUserById = async (username) => {
  const sqlStr = `SELECT * FROM users WHERE username = $1`;
  const promises = [
    checkIfExist("users", "username", username),
    db.query(sqlStr, [username]),
  ];
  const resolvedPromises = await Promise.all(promises);
  return resolvedPromises[1].rows[0];
};
