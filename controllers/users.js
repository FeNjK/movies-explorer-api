const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../errors/http-status-codes');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(
        'Пользователь с указанным _id не найден.',
      );
    }
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      next(new BadRequestError(
        'Поиск осуществляется по некорректным данным.',
      ));
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
    res.send(user.toJSON());
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'ValidationError') {
      next(new BadRequestError(
        'Переданы некорректные данные при создании пользователя.',
      ));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError(
        'Пользователь с таким email уже существует.',
      ));
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
      throw new NotFoundError(
        'Пользователь с указанным _id не найден.',
      );
    }
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        ),
      );
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError(
        'Пожалуйста, заполните все поля ввода.',
      );
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError(
        'Произошла ошибка авторизации. Введите правильные логин и пароль.',
      );
    }
    const authorizedUser = await bcrypt.compare(password, user.password);
    if (!authorizedUser) {
      throw new UnauthorizedError(
        'Произошла ошибка авторизации. Введите правильные логин и пароль.',
      );
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });
    res.send({ message: 'Авторизация прошла успешно.' });
    /* console.log(user.toJSON()); */
    /* res.send({ token }); */
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ message: 'Выход из системы успешно завершен.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUserMe,
  createUser,
  editUserData,
  login,
  logout,
};