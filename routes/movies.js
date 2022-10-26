const routerMovie = require("express").Router();

const {
  getUserMovies,
  saveMovie,
  deleteSavedMovie,
} = require("../controllers/movies");

const {
  createFilmValidation,
  findByIdValidation,
} = require("../middlewares/validation");

routerMovie.get("/movies", getUserMovies);
routerMovie.post("/movies", createFilmValidation, saveMovie);
routerMovie.delete("/movies/:movieId", findByIdValidation, deleteSavedMovie);

module.exports = routerMovie;
