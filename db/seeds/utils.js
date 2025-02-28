const db = require("../../db/connection");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

const lookupAndFormat = (articleData, commentData) => {
  const lookupIDObj = {};
  articleData.forEach((article) => {
    lookupIDObj[article.title] = article.article_id;
  });
  return commentData.map((comment) => {
    const timeCorrection = convertTimestampToDate(comment);
    const copyCommentObj = { ...timeCorrection };
    copyCommentObj.article_id = lookupIDObj[copyCommentObj.article_title];
    delete copyCommentObj.article_title;
    return Object.values(copyCommentObj);
  });
};
module.exports = { convertTimestampToDate, lookupAndFormat };
