const User = require('../models/User');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      } return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const creatUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
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
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } if (e.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
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
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } if (e.name === 'CastError') {
        return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  creatUser,
  updateUser,
  updateAvatar,
};
