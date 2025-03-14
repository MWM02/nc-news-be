const { fetchTopics } = require("../models/topics.models");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};
