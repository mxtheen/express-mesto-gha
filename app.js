const express = require('express');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const { loginUser, createUser } = require('./controllers/users');
const { authMiddleware } = require('./middlewares/auth');
const { validationLogin, validationCreateUser } = require('./middlewares/celebrate/user');
const { serverErrorHandler } = require('./middlewares/serverErrorHandler');

const NotFoundError = require('./utils/errors/NotFoundError');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(cors());

app.use(helmet());

app.use(bodyParser.json());

app.post('/signin', validationLogin, loginUser);
app.post('/signup', validationCreateUser, createUser);

app.use('/users', authMiddleware, usersRouter);
app.use('/cards', authMiddleware, cardsRouter);

app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(serverErrorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен по адресу: ${PORT}`);
});
