const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((e) => res.status(500).send({ message: `Произшла ошибка ${e.message}` }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => res.status(500).send({ message: `Произошла ошибка ${e.message}` }));
};

const creatUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.creat({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => res.status(200).send({ message: `роизошла ошибка ${e.message}` }));
};

module.exports = {
  getUsers,
  getCurrentUser,
  creatUser,
};
