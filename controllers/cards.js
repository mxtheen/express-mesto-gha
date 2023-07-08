const { isValidObjectId } = require('mongoose');
const Card = require('../models/card');

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};
const getCards = (req, res) => {
  Card.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    return;
  }
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    return;
  }
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    return;
  }
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
