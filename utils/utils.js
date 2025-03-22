const format = require("pg-format");
const db = require("../db/connection");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

const formatArticleData = (rawArticleData) => {
  return rawArticleData.map((article) => {
    const articleFormatted = convertTimestampToDate(article);
    return articleFormatted.votes === undefined
      ? [
          articleFormatted.created_at,
          articleFormatted.title,
          articleFormatted.topic,
          articleFormatted.author,
          articleFormatted.body,
          0,
          articleFormatted.article_img_url,
        ]
      : Object.values(articleFormatted);
  });
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

const checkIfExist = async (table_name, column_name, value) => {
  const sqlQuery = format(
    "SELECT * FROM %I WHERE %I = $1",
    table_name,
    column_name
  );
  const results = await db.query(sqlQuery, [value]);
  return results.rows.length
    ? Promise.resolve(true)
    : Promise.reject({
        error: { message: "Resource not found", status: 404 },
      });
};

const verifyReqBody = (requestBody, destructKeys) => {
  for (const key of destructKeys) {
    if (!requestBody[key]) {
      return Promise.reject({
        error: { message: "Invalid request body", status: 400 },
      });
    }
  }
  return true;
};

const verifyPageNum = async (sqlQuery, valuesArr, pageOffset) => {
  const {
    rows: [{ total_count }],
  } = await db.query(sqlQuery, valuesArr);
  return pageOffset + 1 > total_count && total_count !== 0
    ? Promise.reject({
        error: { message: "Page out of range", status: 404 },
      })
    : Promise.resolve(true);
};

module.exports = {
  convertTimestampToDate,
  lookupAndFormat,
  formatArticleData,
  checkIfExist,
  verifyReqBody,
  verifyPageNum,
};
