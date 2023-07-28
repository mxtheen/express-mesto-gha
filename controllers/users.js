const { isValidObjectId } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { CREATED } = require('../utils/statusCodes');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => {
      res.status(CREATED).send({
        name, about, avatar, email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже зарегистрирован.'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
    return;
  }
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
      } else {
        next(err);
      }
    });
};

const getCurrentUserData = (req, res, next) => {
  User.findById(req.user.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Возникла ошибка при попытке получить информацию о профиле'));
      } else {
        next(err);
      }
    });
};

const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next();
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.id, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении автара профиля.'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Неправильная почта или пароль'));
          }
          return res.send({ token: jwt.sign({ id: user._id }, 'super-strong-secret', { expiresIn: '7d' }) });
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  loginUser,
  getCurrentUserData,
};
