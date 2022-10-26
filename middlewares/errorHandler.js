const { internalServerError } = require('../utils/errorMessages');

function errorHandler(err, req, res, next) {
  /* console.log(err); */
  const { statusCode = 500 } = err;
  const { message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? internalServerError
      : message,
  });
  next();
}

module.exports = { errorHandler };
