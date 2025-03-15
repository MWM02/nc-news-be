const { fetchUsers, fetchUserById } = require("../models/users.models");

exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};

exports.getUserById = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await fetchUserById(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
