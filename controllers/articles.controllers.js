const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
  insertArticle,
} = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const articleById = await fetchArticleById(article_id);
    res.status(200).send({ articleById });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const { sort_by = "created_at", order = "DESC", topic } = req.query;
  try {
    const articles = await fetchArticles(sort_by, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const updatedArticle = await updateArticleById(article_id, req.body);
    res.status(200).send({ updatedArticle });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  try {
    const postedArticle = await insertArticle(req.body);
    res.status(201).send({ postedArticle });
  } catch (err) {
    next(err);
  }
};
