const Card = require('../models/Card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch((e) => res.status(500).send({ message: `Произошла ошибка: ${e.message}` }));
};

const addCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((e) => res.status(500).send({ message: `Произшла ошибка: ${e.message}` }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => res.status(500).send({ message: `Произшла ошибка: ${e.message}` }));
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => res.status(500).send({ message: `Произшла ошибка: ${e.message}` }));
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => res.status(500).send({ message: `Произшла ошибка: ${e.message}` }));
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  setLike,
  removeLike,
};
