const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
} = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  try {
    const result = await fetchArticleById(req);
    res.status(200).send({ article: result });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res) => {
  const results = await fetchArticles();
  res.status(200).send({ articles: results });
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const results = await updateArticleById(req);
    res.status(200).send({ article: results });
  } catch (err) {
    next(err);
  }
};
