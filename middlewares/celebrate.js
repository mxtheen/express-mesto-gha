const { celebrate, Joi } = require('celebrate');

const linkRegExp = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-._~:/?#\\[\]@!$&'()*+,;=]+)(#)?$/;

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(4).max(50).required()
      .email(),
    password: Joi.string().min(6).max(20).required(),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(4).max(50).required()
      .email(),
    password: Joi.string().min(6).max(20).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegExp),
  }),
});

const validationUpdateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validationUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkRegExp),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(linkRegExp),
  }),
});

module.exports = {
  validationLogin,
  validationCreateUser,
  validationUpdateUserData,
  validationUpdateUserAvatar,
  validationCreateCard,
};
