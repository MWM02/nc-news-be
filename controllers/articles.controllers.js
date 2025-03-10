const { fetchArticleById } = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const result = await fetchArticleById(article_id);
    return res.status(200).send({ article: result });
  } catch (err) {
    next(err);
  }
};
