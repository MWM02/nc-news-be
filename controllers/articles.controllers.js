const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
} = require("../models/articles.models");
const { checkIfExist, verifyReqBody } = require("../utils/utils");

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

exports.patchArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    verifyReqBody(req.body, ["inc_votes"]),
    updateArticleById(article_id, inc_votes),
  ];
  try {
    const results = await Promise.all(promises);
    res.status(200).send({ article: results[2] });
  } catch (err) {
    next(err);
  }
};
