const { use } = require("../app");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments.models");
const { checkIfExist, verifyBodyForCommentsPost } = require("../utils/utils");

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
    verifyBodyForCommentsPost(username, body),
    insertCommentByArticleId(commentData),
  ];
  try {
    const results = await Promise.all(promises);
    return res.status(201).send({ postedComment: results[2] });
  } catch (err) {
    next(err);
  }
};
