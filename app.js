require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { signInValidation, signUpValidation } = require('./middlewares/validation');
const cors = require('./middlewares/cors');
const routerUser = require('./routes/users');
const routerMovie = require('./routes/movies');
const { login, logout, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/http-status-codes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(cors);
app.post('/signin', signInValidation, login);
app.post('/signup', signUpValidation, createUser);
app.use(auth);
app.post('/signout', logout);
app.use('/', routerUser);
app.use('/', routerMovie);
app.use('*', () => {
  throw new NotFoundError('Ресурс не найден.');
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function runServer() {
  try {
    await mongoose.connect('mongodb://localhost:27017/moviesdb', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Подключение к серверу успешно установлено');

    await app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`);
    });
  } catch (err) {
    console.log('Возникла ошибка в подключении к серверу');
    console.log(err);
  }
}

runServer();
