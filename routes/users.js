const router = require('express').Router();

const {
  createUser, getUsers, getUserById, updateUserData, updateUserAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
