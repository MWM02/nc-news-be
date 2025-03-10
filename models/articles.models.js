const db = require("../db/connection");

exports.fetchArticleById = async (article_id) => {
  const { rows } = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (rows.length === 0) {
    return Promise.reject({
      error: { message: "No matches found", status: 404 },
    });
  }
  return rows[0];
};
