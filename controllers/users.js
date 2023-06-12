const http2 = require('http2');
const User = require('../models/user');

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_CREATED = 201;

const BAD_REQUEST_ERROR = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND_ERROR = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
const DEFAULT_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch((err) => {
      console.error(err.message);
      res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(HTTP_STATUS_OK).send(user);
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect ID' });
      } else {
        console.error(err.message);
        res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data passed during user creation' });
      } else {
        console.error(err.message);
        res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
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
    .then((user) => {
      if (user) {
        res.status(HTTP_STATUS_OK).send(user);
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data passed during user updating' });
      } else {
        console.error(err.message);
        res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
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
    .then((user) => {
      if (user) {
        res.status(HTTP_STATUS_OK).send(user);
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data passed during user updating' });
      } else {
        console.error(err.message);
        res.status(DEFAULT_ERROR).send({ message: 'Something went wrong' });
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
