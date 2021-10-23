// const e = require('express');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError'); // 400
const PageNotFoundError = require('../errors/PageNotFoundError'); // 404
const ForbiddenAccessError = require('../errors/ForbiddenAccessError'); // 403

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
  // .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

//* it works
const addCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
      next(e);
    })
    .catch(next);
};

//* it works
// const deleteCard = (req, res, next) => {
//   const userId = req.user._id;
//   Card.findById(req.params.id)
//     .then((card) => {
//       if (!card) {
//         throw new PageNotFoundError('Карточка не найдена');
//       }
//       if (card.owner.toString() !== userId) {
//         throw new ForbiddenAccessError('Можно удалять только свои карточки');
//       } else {
//         Card.findByIdAndRemove(req.params.id) //! можно поменять на удалить сразу
//           .then((deletedCard) => {
//             res.status(200).send({ data: deletedCard });
//           })
//           .catch(next);
//       }
//     })
//     .catch(next);
// };

//* Переписать на трай кетч
//* Тоже работает
const deleteCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send({ message: 'нет такой карты' });
    }
    if (card.owner.toString() !== userId) {
      throw new Error('you cant delete this card');
    }
    await Card.remove(card);
    return res.status(200).send({ data: card });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ error });
    }
    //    return res.status(500).send({ message: 'На сервере произошла ошибка' });
    return res.status(500).json({ error: error.stack });
  }
};

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
