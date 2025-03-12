const db = require("../db/connection");
const { convertTimestampToDate } = require("../utils/utils");
const format = require("pg-format");

exports.fetchCommentsByArticleId = async (article_id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
    [article_id]
  );
  return rows;
};

exports.insertCommentByArticleId = async (commentToPost) => {
  const sqlStr = format(
    `INSERT INTO comments ( created_at, article_id, author, body) VALUES %L RETURNING *`,
    [Object.values(convertTimestampToDate(commentToPost))]
  );
  const { rows } = await db.query(sqlStr);
  return rows[0];
};

exports.removeCommentById = async (comment_id) => {
  await db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};
