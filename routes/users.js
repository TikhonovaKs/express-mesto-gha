const router = require('express').Router();

// подключается модуль users из файла '../controllers/users', который
// содержит функции getUsers, getUserById и createUser, которые
// обрабатывают соответствующие маршруты /, /:id и /.
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// маршрут путей:
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
