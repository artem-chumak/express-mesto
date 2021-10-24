const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const AlreadyExistsError = require('../errors/AlreadyExistsError'); // 409

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) { next(error); }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
    } return res.status(200).send({ data: user });
  } catch (error) {
    if (error.name === 'CastError') {
      throw new BadRequestError('Переданы некорректные данные'); // кажется, что можно удалить
    } return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
    } return res.status(200).json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      throw new BadRequestError('Переданы некорректные данные'); // кажется, что можно удалить
    } return next(error);
  }
};

const creatUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const prospect = await User.findOne({ email });
    if (prospect) {
      throw new AlreadyExistsError('Такой пользователь уже существует');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    return res.status(201).json({ user }); // тут пароль отправляется, это норм?
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные'); // кажется, что это можно удалить
    } return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundError('Такого пользователя нет');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError('Неверный пароль, попробуйте снова');
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).end();
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные'); // кажется, что это можно удалить
    } return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Такого пользователя нет');
    } return res.status(200).json({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные'); // кажется, что это можно удалить
    } return next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Такого пользователя нет');
    } return res.status(200).json({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные'); // кажется, что это можно удалить
    } return next(error);
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
