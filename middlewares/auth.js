/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/statusCodes');

const handleAuthError = (res) => {
  res.status(UNAUTHORIZED).send({ message: 'Ошибка авторизации' });
};
const extractBearerToken = (header) => header.replace('Bearer ', '');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
module.exports = {
  authMiddleware,
};
