const { isValidObjectId } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED, CONFLICT,
} = require('../utils/errors');

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => {
      res.send({
        name, about, avatar, email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.code === 11000) {
        res.status(CONFLICT).send({ message: `На сервере произошла ошибка: ${err.message}` });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.message}` });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при поиске профиля' });
    return;
  }
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при поиске профиля.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const getCurrentUserData = (req, res) => {
  User.findById(req.user.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const updateUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.id, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED).send({ message: 'Неправильная почта или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(UNAUTHORIZED).send({ message: 'Неправильная почта или пароль' });
          }
          return res.send({ token: jwt.sign({ id: user._id }, 'super-strong-secret', { expiresIn: '7d' }) });
        });
    })
    .catch((err) => {
      res.status(400).send({ message: `Что-то пошло не так: ${err.message}` });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  login,
  getCurrentUserData,
};
