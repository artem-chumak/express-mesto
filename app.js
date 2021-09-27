const express = require('express'); // подключили экспрес
const mongoose = require('mongoose'); // подключили mongoose для работы с Mongod

const { PORT = 3000 } = process.env; // указали порт с дефолтным значением 3000
const app = express(); // включили экспресс

async function start () {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //! не запускается с этими параметрами, ругается, хотя они были в уроке
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    app.listen(PORT, () => console.log(`App listining on port ${PORT}`));
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();
