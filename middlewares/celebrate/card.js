const { celebrate, Joi } = require('celebrate');

const { linkRegExp } = require('../../utils/regEpx');

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(linkRegExp),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validationCreateCard,
  validationCardId,
};
