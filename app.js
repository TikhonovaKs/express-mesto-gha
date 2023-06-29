const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { URL_REGULAR_EXPRESSION } = require('./utils/constData');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const NotFoundError = require('./errors/not-found-err');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// устанавливает middleware для парсинга JSON-тела запросов
app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().pattern(URL_REGULAR_EXPRESSION),
  }),
}), createUser);

app.use(cookieParser());

// // временное решение авторизации
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64832af204556254303a9e8e',
//   };

//   next();
// });

// регистрирует маршруты, определенные в router, в приложении Express

app.use(auth);

app.use(router);

app.use((req, res, next) => next(new NotFoundError('Route not found')));

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler); // централизованный обработчик

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('I am listening port 3000');
});
