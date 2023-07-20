const { isValidObjectId } = require('mongoose');
const Card = require('../models/card');

const { CREATED } = require('../utils/statusCodes');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user.id })
    .then((card) => {
      res.status(CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};
const getCards = (req, res, next) => {
  Card.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
};

const getCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при поиске карточки.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } if (!data.owner.equals(req.user.id)) {
        next(new ForbiddenError('Недостаточно прав для удаления карточки'));
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    next(new BadRequestError('Переданы некорректные данные при поиске карточки.'));
    return;
  }
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user.id } }, { new: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для лайка карточки.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    next(new BadRequestError('Переданы некорректные данные при поиске карточки.'));
    return;
  }
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user.id } }, { new: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для дизлайка карточки.'));
      } else {
        next(err);
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
