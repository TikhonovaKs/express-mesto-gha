const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REGULAR_EXPRESSION } = require('../utils/constData');

// подключается модуль users из файла '../controllers/users', который
// содержит функции getUsers, getUserById и createUser, которые
// обрабатывают соответствующие маршруты /, /:id и /.
const {
  getUsers,
  getUserById,
  getUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// маршрут путей:
router.get('/', getUsers);
router.get('/me', getUserInfo);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(URL_REGULAR_EXPRESSION),
  }),
}), updateAvatar);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .min(2)
      .max(30),
    about: Joi
      .string()
      .required()
      .min(2)
      .max(30),
  }),
}), updateUser);

module.exports = router;
