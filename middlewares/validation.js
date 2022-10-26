const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { BadRequestError } = require('../errors/http-status-codes');
const { errorMessageIncorrectId } = require('../utils/errorMessages');

const idValidation = (value) => {
  const isValid = mongoose.isObjectIdOrHexString(value);
  if (!isValid) {
    throw new BadRequestError(errorMessageIncorrectId);
  }
  return value;
};

const validURL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/mi;

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
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
    image: Joi.string().required().regex(validURL),
    trailerLink: Joi.string().required().regex(validURL),
    thumbnail: Joi.string().required().regex(validURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const findByIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom(idValidation),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  userDataUpdateValidation,
  createFilmValidation,
  findByIdValidation,
};
