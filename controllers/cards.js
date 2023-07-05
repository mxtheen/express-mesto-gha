const Card = require('../models/card');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

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
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `На сервере произошла ошибка: ${err.name}` });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
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
