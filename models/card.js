const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const User = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isUrl(url),
      message: 'Link format is not correct',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: User,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
