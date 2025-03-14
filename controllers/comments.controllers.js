const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const commentsByArticleId = await fetchCommentsByArticleId(article_id);
    res.status(200).send({ commentsByArticleId });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const results = await insertCommentByArticleId(article_id, req.body);
    res.status(201).send({ postedComment: results });
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
    const updatedComment = await updateCommentById(comment_id, req.body);
    res.status(200).send({ updatedComment });
  } catch (err) {
    next(err);
  }
};
