const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64a1dc6feed127f2e07f9a0c',
  };

  next();
});

app.use(bodyParser.json());

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(3000, () => {
  console.log('Cервер запущен!');
});
