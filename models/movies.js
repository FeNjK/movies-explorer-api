const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');

const movieSchema = new Schema(
  {
    country: { // страна создания фильма
      type: String,
      required: true,
    },
    director: { // режиссёр фильма
      type: String,
      required: true,
    },
    duration: { // длительность фильма
      type: Number,
      required: true,
    },
    year: { // год выпуска фильма
      type: String,
      required: true,
    },
    description: { // описание фильма
      type: String,
      required: true,
    },
    image: { // ссылка на постер к фильму
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
      },
    },
    trailerLink: { // ссылка на трейлер фильма
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
      },
    },
    thumbnail: { // миниатюрное изображение постера к фильму
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
      },
    },
    owner: { // _id пользователя, который сохранил фильм
      type: Schema.Types.ObjectId,
      ref: 'user', // сделали ссылку на другую схему через строку
      required: true,
    },
    movieId: { // id фильма, который содержится в ответе сервиса MoviesExplorer
      type: Number,
      required: true,
    },
    nameRU: { // название фильма на русском языке
      type: String,
      required: true,
    },
    nameEN: { // название фильма на английском языке
      type: String,
      required: true,
    },
  },
);

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
