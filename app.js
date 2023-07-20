const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;
const { login, createUser } = require('./controllers/users');
const { authMiddleware } = require('./middlewares/auth');
const { validationLogin, validationCreateUser } = require('./middlewares/celebrate/user');

const { NOT_FOUND } = require('./utils/errors');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use('/users', authMiddleware, usersRouter);
app.use('/cards', authMiddleware, cardsRouter);

app.use(errors());

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен по адресу: ${BASE_PATH}:${PORT}`);
});
