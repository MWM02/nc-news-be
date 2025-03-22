const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  try {
    const comments = await fetchCommentsByArticleId(article_id, limit, p);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const comment = await insertCommentByArticleId(article_id, req.body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    const comment = await updateCommentById(comment_id, req.body);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
