const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ users }))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

const getCurrentUser = (req, res) => User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    } return res.status(200).send({ data: user });
  })
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

const creatUser = (req, res) => User.create({ ...req.body })
  .then((user) => res.status(201).send({ data: user }))
  .catch((e) => {
    if (e.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  });

const updateUser = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  { ...req.body },
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    } return res.status(200).send({ data: user });
  })
  .catch((e) => {
    if (e.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  });

const updateAvatar = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  { ...req.body },
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    } return res.status(200).send({ data: user });
  })
  .catch((e) => {
    if (e.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    } return res.status(500).send({ message: 'На сервере произошла ошибка' });
  });

module.exports = {
  getUsers,
  getCurrentUser,
  creatUser,
  updateUser,
  updateAvatar,
};
