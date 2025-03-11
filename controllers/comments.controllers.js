const { fetchCommentsByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const results = await fetchCommentsByArticleId(article_id);
    return res.status(200).send({ commentsByArticleId: results });
  } catch (err) {
    next(err);
  }
};
