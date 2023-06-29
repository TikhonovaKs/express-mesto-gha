// хеширование паролей и сравнение хэшей паролей с их исходными значениями:
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
// const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundError('User with this Id not found');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect ID'));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User was not found');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedPassword) => {
      User.create({ ...req.body, password: hashedPassword })
        .then((user) => {
          res.send({ data: user });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('User with this email adress is already registered'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Incorrect data passed during user updating'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  // вытащить email, password
  const { email, password } = req.body;

  // проверить существует ли пользователь с таким email
  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      // проверить совпаадет ли password
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            // создать JWT сроком на неделю (maxAge: 36000)
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, 'SECRET');
            // прикрепить его к куке
            res.cookie('jwt', jwt, {
              maxAge: 36000,
              httpOnly: true,
              sameSite: true, // на др. браузеры не будет уходить кука
            });
            // если совпадает вернутьпользователя
            res.send({ data: user.toJSON() });
          } else {
            // если не совпадает вернуть ошибку
            throw new UnauthorizedError('Incorrect password or email');
          }
        });
    })
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        next(new UnauthorizedError('Incorrect password or email'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
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
      if (user) return res.send({ user });

      throw new NotFoundError('User with this Id not found');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data passed during user updating'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
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
      if (user) return res.send({ user });

      throw new NotFoundError('User with this Id not found');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data passed during avatar updating'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
