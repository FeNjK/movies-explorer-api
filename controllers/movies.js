const Movie = require('../models/movie');
const {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/http-status-codes');

const {
  errorMessageNotFoundMovie,
  errorMessageIncorrectMovieDataSave,
  errorMessageMovieDataDuplication,
  errorMessageNoAccessDeleteMovie,
  errorMessageIncorrectMovieDataForDelete,
} = require('../utils/errorMessages');

const getUserMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner }).populate(['owner']);
    if (!movies) {
      throw new NotFoundError(errorMessageNotFoundMovie);
    }
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

const saveMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const owner = req.user._id;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    });
    res.send(movie);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(
        new BadRequestError(errorMessageIncorrectMovieDataSave),
      );
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError(errorMessageMovieDataDuplication));
      return;
    }
    next(err);
  }
};

const deleteSavedMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    const owner = req.user._id;
    if (!movie) {
      throw new NotFoundError(errorMessageNotFoundMovie);
    }
    if (movie.owner.toString() !== owner) {
      throw new ForbiddenError(errorMessageNoAccessDeleteMovie);
    }
    await Movie.findByIdAndRemove(req.params.movieId);
    res.send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      next(
        new BadRequestError(errorMessageIncorrectMovieDataForDelete),
      );
      return;
    }
    next(err);
  }
};

module.exports = {
  getUserMovies,
  saveMovie,
  deleteSavedMovie,
};
