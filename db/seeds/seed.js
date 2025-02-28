const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, lookupAndFormat } = require("./utils");

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

const insertTopicsData = (rawTopicData) => {
  const topicData = rawTopicData.map((topic) => Object.values(topic));
  const sqlStr = format(
    "INSERT INTO topics (description, slug, img_url) VALUES %L",
    topicData
  );
  return db.query(sqlStr);
};

const insertUsersData = (rawUserData) => {
  const userData = rawUserData.map((user) => Object.values(user));
  const sqlStr = format(
    "INSERT INTO users (username, name, avatar_url) VALUES %L",
    userData
  );
  return db.query(sqlStr);
};

const insertArticleData = (rawArticleData) => {
  const articleData = rawArticleData.map((article) => {
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
  const sqlStr = format(
    "INSERT INTO articles ( created_at, title, topic, author, body, votes, article_img_url) VALUES %L RETURNING *",
    articleData
  );
  return db.query(sqlStr);
};

const insertCommentData = (articleData, rawCommentsData) => {
  const commentFormatted = lookupAndFormat(articleData, rawCommentsData);
  console.log(commentFormatted);
  const sqlStr = format(
    "INSERT INTO comments (created_at, body, votes, author, article_id) VALUES %L",
    commentFormatted
  );
  return db.query(sqlStr);
};
module.exports = seed;
