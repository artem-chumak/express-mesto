const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  creatUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getCurrentUser);
router.post('/users', creatUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
