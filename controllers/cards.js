const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const addCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.id)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    } return res.status(200).send({ data: card });
  })
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

const setLike = (req, res) => Card.findByIdAndUpdate(req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true })
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий id карточки' });
    } return res.status(200).send({ data: card });
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  });

const removeLike = (req, res) => Card.findByIdAndUpdate(req.params.id,
  { $pull: { likes: req.user._id } },
  { new: true })
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий id карточки' });
    } return res.status(200).send({ data: card });
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  });

module.exports = {
  getCards,
  addCard,
  deleteCard,
  setLike,
  removeLike,
};
