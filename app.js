const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const NotFoundError = require('./errors/not-found-err');

// импорт роутов signin и signup
const singInRoutes = require('./routes/signin');
const singUpRoutes = require('./routes/signup');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// устанавливает middleware для парсинга JSON-тела запросов
app.use(express.json());

app.use('/', singInRoutes);
app.use('/', singUpRoutes);

app.use(cookieParser());

// защищаем авторизацией все роуты кроме singIn и singUp
app.use(auth);

app.use(router);

app.use((req, res, next) => next(new NotFoundError('Route not found')));

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler); // централизованный обработчик

app.listen(3000, () => {
  console.log('I am listening port 3000');
});
