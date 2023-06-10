const User = require("../models/user");
const ERROR_CODE_INCORRECT_DATA = 400;
const ERROR_CODE_NOT_FOUND = 404;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: "Incorrect data passed during user creation",
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

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error("Not found"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
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

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: "Incorrect data passed during user creation",
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

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: "Invalid data passed when updating profile",
        });
      } else if (err.name === "ValidationError") {
        res.status(ERROR_CODE_NOT_FOUND).send({
          message: "Invalid data passed when updating profile",
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(ERROR_CODE_INCORRECT_DATA).send({
          message: "Invalid data passed when updating avatar",
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
