const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REGULAR_EXPRESSION } = require('../utils/constData');

const {
  createUser,
} = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().pattern(URL_REGULAR_EXPRESSION),
  }),
}), createUser);

module.exports = router;
