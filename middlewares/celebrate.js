const { celebrate, Joi } = require('celebrate');

const avatarRegExp = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-._~:/?#\\[\]@!$&'()*+,;=]+)(#)?$/;

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
    avatar: Joi.string().pattern(avatarRegExp),
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
    avatar: Joi.string().pattern(avatarRegExp),
  }),
});

module.exports = {
  validationLogin,
  validationCreateUser,
  validationUpdateUserData,
  validationUpdateUserAvatar,
};
