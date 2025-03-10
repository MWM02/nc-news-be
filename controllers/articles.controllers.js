const {
  fetchArticleById,
  fetchArticles,
} = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const result = await fetchArticleById(article_id);
    res.status(200).send({ article: result });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res) => {
  const results = await fetchArticles();
  return res.status(200).send({ articles: results });
};
