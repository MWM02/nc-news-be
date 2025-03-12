const db = require("../db/connection");
const {
  convertTimestampToDate,
  checkIfExist,
  verifyReqBody,
} = require("../utils/utils");
const format = require("pg-format");

exports.fetchCommentsByArticleId = async (req) => {
  const { article_id } = req.params;
  const sqlStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    db.query(sqlStr, [article_id]),
  ];
  const results = await Promise.all(promises);
  return results[1].rows;
};

exports.insertCommentByArticleId = async (req) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const commentData = {
    article_id,
    username,
    body,
    created_at: Date.now(),
  };
  const sqlStr = format(
    `INSERT INTO comments ( created_at, article_id, author, body) VALUES %L RETURNING *`,
    [Object.values(convertTimestampToDate(commentData))]
  );
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    verifyReqBody(req.body, ["username", "body"]),
    db.query(sqlStr),
  ];
  const results = await Promise.all(promises);
  return results[2].rows[0];
};

exports.removeCommentById = async (req) => {
  const { comment_id } = req.params;
  const sqlStr = `DELETE FROM comments WHERE comment_id = $1`;
  const promises = [
    checkIfExist("comments", "comment_id", comment_id),
    db.query(sqlStr, [comment_id]),
  ];
  await Promise.all(promises);
};
