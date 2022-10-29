const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/http-status-codes');
const {
  errorMessageUserAuthorizations,
  errorMessageNoUserToken,
} = require('../utils/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  /* console.log(token); */
  let payload;
  try {
    if (!token) {
      next(new UnauthorizedError(errorMessageNoUserToken));
      return;
    }
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    console.log(err);
    next(new UnauthorizedError(errorMessageUserAuthorizations));
    return;
  }
  req.user = payload;
  next();
};

module.exports = auth;
