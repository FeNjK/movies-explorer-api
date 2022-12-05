/* const mongoose = require('mongoose'); */
const { celebrate, Joi } = require('celebrate');
/* const { BadRequestError } = require('../errors/http-status-codes');
const { errorMessageIncorrectId } = require('../utils/errorMessages'); */

/* const idValidation = (value) => {
  const isValid = mongoose.isObjectIdOrHexString(value);
  if (!isValid) {
    throw new BadRequestError(errorMessageIncorrectId);
  }
  return value;
}; */

const validURL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/mi;
const validPassword = /^[a-zA-Z0-9]{6,40}$/m;
const validEmail = /^(([^().,;:s@"]+(.[^<>().,;:s@"]+)*))@(([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3})|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().regex(validEmail),
    password: Joi.string().required().regex(validPassword),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().regex(validEmail),
    password: Joi.string().required().regex(validPassword),
    name: Joi.string().required().min(2).max(30),
  }),
});

const userDataUpdateValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().regex(validEmail),
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
    /* movieId: Joi.string().required().custom(idValidation), */
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  userDataUpdateValidation,
  createFilmValidation,
  findByIdValidation,
};
