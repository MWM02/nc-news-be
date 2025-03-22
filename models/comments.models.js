const db = require("../db/connection");
const {
  convertTimestampToDate,
  checkIfExist,
  verifyReqBody,
  verifyPageNum,
} = require("../utils/utils");
const format = require("pg-format");

exports.fetchCommentsByArticleId = async (article_id, limit = 10, p = 1) => {
  const pageOffset = limit * (p - 1);
  const sqlStr = format(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT %L OFFSET %L`,
    limit,
    pageOffset
  );
  const sqlStrForTotal = `SELECT COUNT(*) ::INT as total_count FROM comments WHERE article_id = $1`;
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    db.query(sqlStr, [article_id]),
    verifyPageNum(sqlStrForTotal, [article_id], pageOffset),
  ];
  const resolvedPromises = await Promise.all(promises);

  return resolvedPromises[1].rows;
};

exports.insertCommentByArticleId = async (article_id, reqBody) => {
  const { username, body } = reqBody;
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
    verifyReqBody(reqBody, ["username", "body"]),
    db.query(sqlStr),
  ];
  const resolvedPromises = await Promise.all(promises);

  return resolvedPromises[2].rows[0];
};

exports.removeCommentById = async (comment_id) => {
  const sqlStr = `DELETE FROM comments WHERE comment_id = $1`;
  const promises = [
    checkIfExist("comments", "comment_id", comment_id),
    db.query(sqlStr, [comment_id]),
  ];

  await Promise.all(promises);
};

exports.updateCommentById = async (comment_id, reqBody) => {
  const { inc_votes } = reqBody;
  const sqlStr = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`;
  const promises = [
    checkIfExist("comments", "comment_id", comment_id),
    verifyReqBody(reqBody, ["inc_votes"]),
    db.query(sqlStr, [inc_votes, comment_id]),
  ];
  const results = await Promise.all(promises);

  return results[2].rows[0];
};
