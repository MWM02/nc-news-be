const db = require("../db/connection");
const format = require("pg-format");
const { verifyReqBody } = require("../utils/utils");

exports.fetchTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics`);

  return rows;
};

exports.insertTopic = async (reqBody) => {
  const { slug, description, img_url = "" } = reqBody;
  const sqlStr = format(
    `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *`,
    [[slug, description, img_url]]
  );
  const resolvedPromises = await Promise.all([
    verifyReqBody(reqBody, ["slug", "description"]),
    db.query(sqlStr),
  ]);
  const { rows } = resolvedPromises[1];

  return rows[0];
};
