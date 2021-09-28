// 1. Обернул всё в функцию start (посмотрел у Владилена Минина),
//    т.к. из-за параметров Mongoose не запускалось. Так смог отловить ошибку.
// 2. Коды ошибок не завернул в константы, т.к. не понимаю, как это делат, чтобы это имело смысл.
// 3. Поиск по ID ищет только по длине ID. И там начинается проблемы с выдачей ошибок.
//    может вернуться null. Может есть другие способы отработать ошибки красиво

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6152e197f45e400409b30568',
  };

  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //! не запускается с этими параметрами, ругается, хотя они были в уроке
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    app.listen(PORT, () => console.log(`App listining on port: >>> ${PORT} <<<`));
  } catch (e) {
    console.log('Server ERROR: >>>', e.message);
    process.exit(1);
  }
}

start();
