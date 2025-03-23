const { fetchTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};

exports.postTopic = async (req, res, next) => {
  try {
    const topic = await insertTopic(req.body);
    res.status(201).send({ topic });
  } catch (err) {
    next(err);
  }
};
