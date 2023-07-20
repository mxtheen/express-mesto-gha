const { isValidObjectId } = require('mongoose');
const Card = require('../models/card');

const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, FORBIDDEN,
} = require('../utils/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user.id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: err.message });
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

const getCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при поиске карточки.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } if (!data.owner.equals(req.user.id)) {
        return res.status(FORBIDDEN).send({ message: 'Недостаточно прав для удаления карточки' });
      }
      return res.send(data);
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
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные при поиске карточки.' });
    return;
  }
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user.id } }, { new: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные при поиске карточки.' });
    return;
  }
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user.id } }, { new: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
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
  getCardById,
};
