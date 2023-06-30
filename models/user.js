const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => isUrl(url),
      message: 'Link format is not correct',
    },
  },
  email: {
    type: String,
    required: [true, 'The "email" field is required'],
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Email format is not correct',
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, 'The "password" field is required'],
  },
});

// исключаем видимость пароля для пользователя (применим метод toJSON в контроллере
// users.js для функции login):
userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;

  return user;
};

module.exports = mongoose.model('user', userSchema);
