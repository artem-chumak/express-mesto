const express = require('express'); // подключили экспрес
const mongoose = require('mongoose'); // подключили mongoose для работы с Mongod
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env; // указали порт с дефолтным значением 3000
const app = express(); // включили экспресс

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//! сделала, т.к. это было описано в задании, что это даёт до конца не понял пока
app.use((req, res, next) => {
  req.user = {
    _id: '6151f4d83fe9cccbb7ea5d6b',
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
