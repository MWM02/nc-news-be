const db = require("../connection");
const format = require("pg-format");
const { lookupAndFormat, formatArticleData } = require("../../utils/utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics");
    })
    .then(() => {
      return createTopics();
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createArticles();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      return insertTopicsData(topicData);
    })
    .then(() => {
      return insertUsersData(userData);
    })
    .then(() => {
      return insertArticleData(articleData);
    })
    .then(({ rows }) => {
      return insertCommentData(rows, commentData);
    });
};

const createTopics = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS topics (
    slug VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
    description VARCHAR(255) NOT NULL, 
    img_url VARCHAR(1000) NOT NULL
    );
    `);
};

const createUsers = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL
    );
    `);
};

const createArticles = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) REFERENCES topics(slug),
    author VARCHAR(255) REFERENCES users(username),
    body TEXT NOT NULL,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000) NOT NULL
    );
    `);
};

const createComments = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id),
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(255) REFERENCES users(username),
    created_at TIMESTAMP
    );
    `);
};

const insertTopicsData = async (rawTopicData) => {
  const topicData = rawTopicData.map((topic) => Object.values(topic));
  const sqlStr = format(
    "INSERT INTO topics (description, slug, img_url) VALUES %L",
    topicData
  );
  return await db.query(sqlStr);
};

const insertUsersData = async (rawUserData) => {
  const userData = rawUserData.map((user) => Object.values(user));
  const sqlStr = format(
    "INSERT INTO users (username, name, avatar_url) VALUES %L",
    userData
  );
  return await db.query(sqlStr);
};

const insertArticleData = async (rawArticleData) => {
  const articleFormatted = formatArticleData(rawArticleData);
  const sqlStr = format(
    "INSERT INTO articles ( created_at, title, topic, author, body, votes, article_img_url) VALUES %L RETURNING *",
    articleFormatted
  );
  return await db.query(sqlStr);
};

const insertCommentData = async (articleData, rawCommentsData) => {
  const commentFormatted = lookupAndFormat(articleData, rawCommentsData);
  const sqlStr = format(
    "INSERT INTO comments (created_at, body, votes, author, article_id) VALUES %L",
    commentFormatted
  );
  return await db.query(sqlStr);
};
module.exports = seed;
