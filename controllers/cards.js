// подключение модели пользователя, определенной в файле ../models/card
const Card = require("../models/card");

const ERROR_CODE_INCORRECT_DATA = 400;

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: "Incorrect data passed during card creation",
        });
      } else {
        res.status(500).send({
          message: "Internal Server Error",
          err: err.message,
          stack: err.stack,
        });
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
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: "Incorrect data passed during card creation"
        });
      } else {
        res.status(500).send({
          message: "Internal Server Error",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => new Error("Not found"))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === "Not found") {
        res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(500).send({
          message: "Internal Server Error",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

// Контроллер для установки лайка карточке
const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      return res
        .status(404)
        .json({ message: "Передан несуществующий _id карточки." });
    }
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!card) {
      return res
        .status(404)
        .json({ message: "Передан несуществующий _id карточки." });
    }
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
