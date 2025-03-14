const format = require("pg-format");
const db = require("../db/connection");
const {
  checkIfExist,
  verifyReqBody,
  convertTimestampToDate,
} = require("../utils/utils");

exports.fetchArticleById = async (article_id) => {
  const sqlStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(articles.article_id) ::INT as comment_count  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`;
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    db.query(sqlStr, [article_id]),
  ];
  const resolvedPromises = await Promise.all(promises);
  return resolvedPromises[1].rows[0];
};

exports.fetchArticles = async (sort_by, order, topic) => {
  const values = [];
  const promises = [];
  let sqlPromiseIndex = 0;
  let sqlStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(articles.article_id) ::INT as comment_count  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  if (topic) {
    sqlStr += `WHERE topic = $1`;
    values.push(topic);
    promises.push(checkIfExist("topics", "slug", topic));
    sqlPromiseIndex++;
  }

  sqlStr += format(` GROUP BY articles.article_id ORDER BY %I `, sort_by);

  if (order.toUpperCase() === "DESC" || order.toUpperCase() === "ASC") {
    sqlStr += order;
  } else {
    return Promise.reject({
      error: { message: "Invalid order in request query", status: 400 },
    });
  }
  promises.push(db.query(sqlStr, values));
  const resolvedPromises = await Promise.all(promises);
  const { rows } = resolvedPromises[sqlPromiseIndex];
  return rows;
};

exports.updateArticleById = async (article_id, reqBody) => {
  const { inc_votes } = reqBody;
  const sqlStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    verifyReqBody(reqBody, ["inc_votes"]),
    db.query(sqlStr, [inc_votes, article_id]),
  ];
  const resolvedPromises = await Promise.all(promises);
  return resolvedPromises[2].rows[0];
};

exports.insertArticle = async (reqBody) => {
  const {
    author,
    title,
    body,
    topic,
    article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
  } = reqBody;
  const articleData = {
    author,
    title,
    body,
    topic,
    article_img_url,
    created_at: Date.now(),
  };
  const sqlStr = format(
    `INSERT INTO articles (created_at, author, title, body, topic, article_img_url) VALUES %L RETURNING article_id`,
    [Object.values(convertTimestampToDate(articleData))]
  );
  const promises = [
    verifyReqBody(reqBody, ["author", "title", "body", "topic"]),
    db.query(sqlStr),
  ];
  const resolvedPromises = await Promise.all(promises);
  const {
    rows: [{ article_id }],
  } = resolvedPromises[1];
  const article = await exports.fetchArticleById(article_id);
  return article;
};
