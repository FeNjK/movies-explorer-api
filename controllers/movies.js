const Movie = require('../models/movie');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/http-status-codes');

const {
  errorMessageNotFoundMovie,
  errorMessageIncorrectMovieDataSave,
  errorMessageNoAccessDeleteMovie,
  errorMessageIncorrectMovieDataForDelete,
} = require('../utils/errorMessages');

const getUserMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner }).populate(['owner']);
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

const saveMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    res.send(movie);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(errorMessageIncorrectMovieDataSave),
      );
      return;
    }
    next(err);
  }
};

const deleteSavedMovie = async (req, res, next) => {
  try {
    /* const movie = await Movie.findById(req.params.movieId); */
    const owner = req.user._id;
    const movie = await Movie.findOne({ movieId: req.params.movieId, owner });
    if (!movie) {
      throw new NotFoundError(errorMessageNotFoundMovie);
    }
    if (movie.owner.toString() !== owner) {
      throw new ForbiddenError(errorMessageNoAccessDeleteMovie);
    }
    /* await Movie.findByAndRemove(req.params.movieId); */
    await Movie.findOneAndRemove({ movieId: req.params.movieId });
    res.send(movie);
    /* console.log(movie.movieId); */
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
