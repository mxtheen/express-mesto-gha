const router = require('express').Router();

const {
  getUsers, getUserById, updateUserData, updateUserAvatar, getCurrentUserData,
} = require('../controllers/users');
const { validationUpdateUserAvatar, validationUpdateUserData, validationGetUserById } = require('../middlewares/celebrate/user');

router.get('/', getUsers);
router.get('/me', getCurrentUserData);
router.get('/:userId', validationGetUserById, getUserById);
router.patch('/me', validationUpdateUserData, updateUserData);
router.patch('/me/avatar', validationUpdateUserAvatar, updateUserAvatar);

module.exports = router;
