const { celebrate, Joi } = require('celebrate');

const { linkRegExp } = require('../../utils/regEpx');

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(4).max(50).required()
      .email(),
    password: Joi.string().max(20).required(),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(4).max(50).required()
      .email(),
    password: Joi.string().max(20).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegExp),
  }),
});

const validationGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
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
module.exports = {
  validationLogin,
  validationCreateUser,
  validationUpdateUserData,
  validationUpdateUserAvatar,
  validationGetUserById,
};
