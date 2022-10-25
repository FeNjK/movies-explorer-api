const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { BadRequestError } = require('../errors/http-status-codes');
const { findById } = require('../models/movie');

const idValidation = (value) => {
  const isValid = mongoose.isObjectIdOrHexString(value);
  if (!isValid) {
    throw new BadRequestError('Переданный _id объекта некорректен.');
  }
  return value;
};

const URLValidation = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/mi;
const passwordValidation = /^[a-zA-Z0-9]{8,30}$/;

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(passwordValidation),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(passwordValidation),
    name: Joi.string().min(2).max(30),
  }),
});

const userDataUpdateValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const createFilmValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(URLValidation),
    trailerLink: Joi.string().required().custom(URLValidation),
    thumbnail: Joi.string().required().custom(URLValidation),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const findByIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(idValidation),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  userDataUpdateValidation,
  createFilmValidation,
  findByIdValidation,
};
