const http2 = require('http2');
const Card = require('../models/card');

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;

const BAD_REQUEST_ERROR = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND_ERROR = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
const DEFAULT_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      console.error(err.message);
      res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
    });
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data passed during card creation' });
      } else {
        console.error(err.message);
        res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card) {
        res.status(HTTP_STATUS_OK).send(card);
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Card not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Wrong format' });
      } else {
        console.error(err.message);
        res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
      }
    });
};

// Контроллер для установки лайка карточке
const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      res
        .status(NOT_FOUND_ERROR)
        .json({ message: 'Invalid card ID passed' });
    } else res.status(HTTP_STATUS_OK).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid format' });
    } else {
      console.error(err.message);
      res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      res
        .status(NOT_FOUND_ERROR)
        .json({ message: 'Invalid card ID passed' });
    } else res.status(HTTP_STATUS_OK).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid format was sent to unlike' });
    } else {
      console.error(err.message);
      res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
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
