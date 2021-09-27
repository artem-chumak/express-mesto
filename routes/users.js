const router = require('express').Router();

const {
  getUsers,
  getCurrentUser,
  creatUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getCurrentUser);
router.post('/users', creatUser);

module.exports = router;
