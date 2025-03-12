const format = require("pg-format");
const db = require("../db/connection");
const { checkIfExist, verifyReqBody } = require("../utils/utils");

exports.fetchArticleById = async (req) => {
  const { article_id } = req.params;
  const sqlStr = `SELECT * FROM articles WHERE article_id = $1`;
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    db.query(sqlStr, [article_id]),
  ];
  const results = await Promise.all(promises);
  return results[1].rows[0];
};

exports.fetchArticles = async (req) => {
  const { sort_by = "created_at", order = "DESC" } = req.query;
  let sqlStr = format(
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(articles.article_id) ::INT as comment_count  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY %I `,
    sort_by
  );
  if (order.toUpperCase() === "DESC" || order.toUpperCase() === "ASC") {
    sqlStr += order;
  } else {
    return Promise.reject({
      error: { message: "Invalid order in request query", status: 400 },
    });
  }
  const { rows } = await db.query(sqlStr);
  return rows;
};

exports.updateArticleById = async (req) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const sqlStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    verifyReqBody(req.body, ["inc_votes"]),
    db.query(sqlStr, [inc_votes, article_id]),
  ];
  const results = await Promise.all(promises);
  return results[2].rows[0];
};
