const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const results = await fetchCommentsByArticleId(req);
    res.status(200).send({ commentsByArticleId: results });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  try {
    const results = await insertCommentByArticleId(req);
    res.status(201).send({ postedComment: results });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    await removeCommentById(req);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
