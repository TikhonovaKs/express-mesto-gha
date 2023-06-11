const http2 = require('http2');
const Card = require('../models/card');

const BAD_REQUEST_ERROR = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND_ERROR = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
const DEFAULT_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "Incorrect data passed during card creation" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "Incorrect data passed during card creation" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => res.status(NOT_FOUND_ERROR).send({ message: "Card not found" }))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "Card not found" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
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
      return res
        .status(NOT_FOUND_ERROR)
        .json({ message: "Invalid card ID passed" });
    }
    res.status(200).json(card);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(BAD_REQUEST_ERROR).send({ message: "Incorrect data was sent to set like" });
    } else {
      res.status(DEFAULT_ERROR).send({ message: err.message });
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
      return res
        .status(NOT_FOUND_ERROR)
        .json({ message: "Invalid card ID passed" });
    }
    res.status(200).json(card);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(BAD_REQUEST_ERROR).send({ message: "Incorrect data was sent to unlike" });
    } else {
      res.status(DEFAULT_ERROR).send({ message: err.message });
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
