const http2 = require('http2');
const User = require("../models/user");

const BAD_REQUEST_ERROR = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND_ERROR = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
const DEFAULT_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "Incorrect data passed during user creation" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => res.status(NOT_FOUND_ERROR).send({ message: "User not found" }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "User not found" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "Incorrect data passed during user creation" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => res.status(NOT_FOUND_ERROR).send({ message: "User not found" }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "Incorrect data passed during user updating" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .orFail(() => res.status(NOT_FOUND_ERROR).send({ message: "User not found" }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR).send({ message: "Incorrect data passed during user updating" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
