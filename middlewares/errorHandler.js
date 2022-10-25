function errorHandler(err, req, res, next) {
  /* console.log(err); */
  const { statusCode = 500 } = err;
  const { message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Произошла внутренняя ошибка сервера.'
      : message,
  });
  next();
}

module.exports = { errorHandler };
