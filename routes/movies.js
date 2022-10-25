const routerMovie = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  createFilmValidation,
  findByIdValidation,
} = require('../middlewares/validation');

routerMovie.get('/movies', getMovies);
routerMovie.post('/movies', createFilmValidation, createMovie);
routerMovie.delete('/movies/:movieId ', findByIdValidation, deleteMovie);

module.exports = routerMovie;
