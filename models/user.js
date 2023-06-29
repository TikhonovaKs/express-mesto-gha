const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Поле "password" должно быть заполнено'],
  },
});

// исключаем видимость пароля для пользователя (применим метод toJSON в контроллере
// users.js для функции login):
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;

  return user;
};

module.exports = mongoose.model('user', userSchema);
