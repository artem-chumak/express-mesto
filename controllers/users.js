const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// then написано

// const getUsers = (req, res) => User.find({})
//   .then((users) => res.status(200).send({ users }))
//   .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

// const getCurrentUser = (req, res) => User.findById(req.params.id)
//   .then((user) => {
//     if (!user) {
//       return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
//     } return res.status(200).send({ data: user });
//   })
//   .catch((e) => {
//     if (e.name === 'CastError') {
//       return res.status(400).send({ mussage: 'Переданы некорректные данные' });
//     } return res.status(500).send({ message: 'На сервере произошла ошибка' });
//   });

// const creatUser = (req, res) => User.create({ ...req.body })
//   .then((user) => res.status(201).send({ data: user }))
//   .catch((e) => {
//     if (e.name === 'ValidationError') {
//       return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
//     }
//     return res.status(500).send({ message: 'На сервере произошла ошибка' });
//   });

// const updateUser = (req, res) => User.findByIdAndUpdate(
//   req.user._id,
//   { ...req.body },
//   {
//     new: true,
//     runValidators: true,
//   },
// )
//   .then((user) => {
//     if (!user) {
//       return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
//     } return res.status(200).send({ data: user });
//   })
//   .catch((e) => {
//     if (e.name === 'ValidationError') {
//       return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
//     }
//     return res.status(500).send({ message: 'На сервере произошла ошибка' });
//   });

// const updateAvatar = (req, res) => User.findByIdAndUpdate(
//   req.user._id,
//   { ...req.body },
//   {
//     new: true,
//     runValidators: true,
//   },
// )
//   .then((user) => {
//     if (!user) {
//       return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
//     } return res.status(200).send({ data: user });
//   })
//   .catch((e) => {
//     if (e.name === 'ValidationError') {
//       return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
//     } return res.status(500).send({ message: 'На сервере произошла ошибка' });
//   });

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    } return res.status(200).send({ data: user });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ mussage: 'Переданы некорректные данные' });
    } return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь с таким id не найден' });
    } return res.status(200).json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).jsor({ message: 'Некорректные данные' });
    } return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const creatUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const prospect = await User.findOne({ email });
    if (prospect) {
      return res.status(400).json({ message: 'Такой пользователь уже есть' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    return res.status(201).json({ user }); // тут пароль можно не передавать
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    } return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Такого пользователя нет' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).end();
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    } return res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'Пользователь по указанному id не найден' });
    } return res.status(200).json({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    } return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'Пользователь по указанному id не найден' });
    } return res.status(200).json({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    } return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  creatUser,
  login,
  updateUser,
  updateAvatar,
};
