const router = require('express').Router();

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard, getCardById,
} = require('../controllers/cards');
const { validationCreateCard, validationCardId } = require('../middlewares/celebrate/card');

router.get('/', getCards);
router.get('/:cardId', validationCardId, getCardById);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardId', validationCardId, deleteCard);
router.put('/:cardId/likes', validationCardId, likeCard);
router.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
