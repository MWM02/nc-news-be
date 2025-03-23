const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
  insertArticle,
  removeArticleById,
} = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await fetchArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;

  try {
    const articlesAndCount = await fetchArticles(
      sort_by,
      order,
      topic,
      limit,
      p
    );
    res.status(200).send(articlesAndCount);
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await updateArticleById(article_id, req.body);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  try {
    const article = await insertArticle(req.body);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    await removeArticleById(article_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
