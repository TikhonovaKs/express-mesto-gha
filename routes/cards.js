const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REGULAR_EXPRESSION } = require('../utils/constData');

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .min(2)
      .max(30),
    link: Joi
      .string()
      .pattern(URL_REGULAR_EXPRESSION),
  }),
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteCardById);

router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

router.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
