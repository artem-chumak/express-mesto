const { Schema, model } = require('mongoose'); // подключили mongoose для работы с Mongod

const userSchema = new Schema({ // создаём схему для юзера
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = model('User', userSchema); // создаём модель и экспортируем её

// Аккуратно — тут можно запутаться.
// Первый аргумент — имя модели — должно быть существительным
// в единственном числе. Но Compass отображает его во множественном.
// Дело в том, что Mongoose автоматически добавляет букву "s" в конце имени коллекции
