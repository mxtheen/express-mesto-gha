const router = require('express').Router();

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard } = require('../middlewares/celebrate');

router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
