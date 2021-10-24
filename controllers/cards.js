// const e = require('express');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError'); // 400
const PageNotFoundError = require('../errors/PageNotFoundError'); // 404
const ForbiddenAccessError = require('../errors/ForbiddenAccessError'); // 403

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json({ cards });
  } catch (error) {
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const addCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = new Card({ name, link, owner });
    await card.save();
    return res.status(201).json({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные' });
    } return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Карточки с таким номером нет' });
    }
    if (card.owner.toString() !== userId) {
      return res.status(409).json({ message: 'Можно удалять только свои карточки' });
    }
    await Card.remove(card);
    return res.status(200).json({ data: card });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Некорректные данные' });
    } return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const setLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(404).json({ message: 'Передан несуществующий id карточки' });
    } return res.status(200).json({ data: card });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Некорректные данные' });
    } return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const removeLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий id карточки' });
    } return res.status(200).send({ data: card });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  setLike,
  removeLike,
};
