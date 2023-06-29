const router = require('express').Router();

// подключаем модули userRoutes и cardRoutes из файлов './users' и '/cards'
const userRoutes = require('./users');
const cardRoutes = require('./cards');
// const signinRoutes = require('./signin');

// вызываем метод .use() роутера для определения маршрута /users и /cards.
// userRoutes и cardRoutes - обработчики для маршрута
// router.use('', signinRoutes);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
