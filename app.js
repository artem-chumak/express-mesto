const express = require('express'); // подключили экспрес
const mongoose = require('mongoose'); // подключили mongoose для работы с Mongod

const { PORT = 3000 } = process.env; // указали порт с дефолтным значением 3000

mongoose.connect('mongodb://localhost:27017/mestodb', { // подключили БД. Не забыть, что перед запуском нужно включить БД в терминале mongod
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express(); // включили экспресс

app.listen(PORT, () => { // запустили экспресс
  console.log(`App listening on port ${PORT}`);
});
