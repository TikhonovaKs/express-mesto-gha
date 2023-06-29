const Card = require('../models/card');

const BadRequestError = require('../errors/bad-request-err');
// const ConflictError = require('../errors/conflict-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
// const UnauthorizedError = require('../errors/unauthorized-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data passed during card updating'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }

      // Проверяем, принадлежит ли карточка текущему пользователю
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('You are not allowed to delete this card');
      }

      // Если все проверки пройдены успешно, удаляем карточку
      return Card.findByIdAndRemove(req.params.id);
    })
    .then((deletedCard) => {
      res.send({ card: deletedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Wrong format'));
      } else {
        next(err);
      }
    });
};

// Контроллер для установки лайка карточке
const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Invalid card ID passed');
      // res
      //   .status(NOT_FOUND_ERROR)
      //   .json({ message: 'Invalid card ID passed' });
    } res.send({ card });
    // else res.status(HTTP_STATUS_OK).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid format'));
      // res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid format' });
    } else {
      next(err);
      // console.error(err.message);
      // res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Invalid card ID passed');
    } res.send({ card });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid format'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
