const User = require('../models/User');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((e) => res.status(500).send({ message: `Произшла ошибка: ${e.message}` }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => res.status(500).send({ message: `Произошла ошибка: ${e.message}` }));
};

const creatUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((e) => res.status(500).send({ message: `Произошла ошибка: ${e.message}` }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => res.status(500).send({ message: `Произошла ошибка: ${e.message}` }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => res.status(500).send({ massage: `Произошла ошибка: ${e.message}` }));
};

module.exports = {
  getUsers,
  getCurrentUser,
  creatUser,
  updateUser,
  updateAvatar,
};
