const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/http-status-codes');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  /* console.log(token); */
  let payload;
  try {
    if (!token) {
      next(new UnauthorizedError(
        'Произошла ошибка авторизации. Введите правильные логин и пароль.',
      ));
      return;
    }
    payload = jwt.verify(
      token,
      NODE_ENV === 'production'
        ? JWT_SECRET
        : 'dev-secret',
    );
  } catch (err) {
    console.log(err);
    next(new UnauthorizedError(
      'Произошла ошибка авторизации. Введите правильные логин и пароль.',
    ));
    return;
  }
  req.user = payload;
  next();
};

module.exports = auth;
