const db = require("../db/connection");
const { checkIfExist } = require("../utils/utils");

exports.fetchCommentsByArticleId = async (article_id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments WHERE article_id = $1`,
    [article_id]
  );
  if (rows.length === 0) {
    await checkIfExist("articles", "article_id", article_id);
  }
  return rows;
};
