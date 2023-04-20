const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../errors/http-status-codes');

const {
  errorMessageNotFoundUser,
  errorMessageIncorrectUserDataSearch,
  errorMessageIncorrectUserDataCreation,
  errorMessageUserDataDuplication,
  errorMessageIncorrectUserDataEdition,
  errorMessageUserAuthorizations,
} = require('../utils/errorMessages');

const {
  goodMessageUserAuthorizations,
  goodMessageUserLogout,
} = require('../utils/goodMessages');

const cookieSettings = require('../utils/cookieSettings');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(errorMessageNotFoundUser);
    }
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      next(new BadRequestError(errorMessageIncorrectUserDataSearch));
      return;
    }
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'ValidationError') {
      next(new BadRequestError(errorMessageIncorrectUserDataCreation));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError(errorMessageUserDataDuplication));
      return;
    }
    next(err);
  }
};

const editUserData = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError(errorMessageNotFoundUser);
    }
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new BadRequestError(errorMessageIncorrectUserDataEdition));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError(errorMessageUserDataDuplication));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError(errorMessageUserAuthorizations);
    }
    const authorizedUser = await bcrypt.compare(password, user.password);
    if (!authorizedUser) {
      throw new UnauthorizedError(errorMessageUserAuthorizations);
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, cookieSettings);
    res.send({ message: goodMessageUserAuthorizations });
    /* console.log(user.toJSON()); */
    /* console.log(token); */
    /* res.send({ token }); */
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: goodMessageUserLogout });
};

module.exports = {
  getUserMe,
  createUser,
  editUserData,
  login,
  logout,
};
