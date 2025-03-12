const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
} = require("../models/comments.models");
const { checkIfExist, verifyReqBody } = require("../utils/utils");

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    fetchCommentsByArticleId(article_id),
  ];
  try {
    const results = await Promise.all(promises);
    return res.status(200).send({ commentsByArticleId: results[1] });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const commentData = {
    article_id,
    username,
    body,
    created_at: Date.now(),
  };
  const promises = [
    checkIfExist("articles", "article_id", article_id),
    verifyReqBody(req.body, ["username", "body"]),
    insertCommentByArticleId(commentData),
  ];
  try {
    const results = await Promise.all(promises);
    return res.status(201).send({ postedComment: results[2] });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [
    checkIfExist("comments", "comment_id", comment_id),
    removeCommentById(comment_id),
  ];
  try {
    await Promise.all(promises);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};
