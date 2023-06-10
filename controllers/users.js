const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.message === "Not found") {
        res.status(400).send({
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

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message === "Not found") {
        res.status(400).send({
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
    { name: req.body.name },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    }
  )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message === "Not found") {
        res.status(400).send({
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
    }
  )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message === "Not found") {
        res.status(400).send({
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
