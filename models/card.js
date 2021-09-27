const { Types, Schema, model } = require('mongoose'); // подключили mongoose для работы с Mongod

const cardSchema = new Schema({ // создаём схему для карточки
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Types.ObjectId,
    ref: 'user',
  },
  likes: [{
    type: Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('card', cardSchema); // создаём модель и экспортируем её

// Аккуратно — тут можно запутаться.
// Первый аргумент — имя модели — должно быть существительным
// в единственном числе. Но Compass отображает его во множественном.
// Дело в том, что Mongoose автоматически добавляет букву "s" в конце имени коллекции
