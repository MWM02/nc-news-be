const { fetchUsers, fetchUserById } = require("../models/users.models");

exports.getUsers = async (req, res) => {
  const results = await fetchUsers();
  res.status(200).send({ users: results });
};

exports.getUserById = async (req, res, next) => {
  try {
    const result = await fetchUserById(req);
    res.status(200).send({ user: result });
  } catch (err) {
    next(err);
  }
};
