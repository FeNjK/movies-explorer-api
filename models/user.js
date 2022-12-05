const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');
// const { validEmail, validPassword } = require('../middlewares/validation');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Требуется ввести email'],
      unique: true,
      validate: {
        validator(v) {
          /* return validEmail.test(v); */
          return validator.isEmail(v);
        },
        message: 'Неправильный формат почты',
      },
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: [true, 'Требуется ввести имя'],
    },
    password: {
      type: String,
      required: [true, 'Требуется ввести пароль'],
      select: false, // эту настройку включать только после проверки хэширования
      validate: {
        validator(v) {
          /* return validPassword.test(v); */
          return validator.isStrongPassword(v);
        },
        message: 'Ваш пароль не удовлетворяет требования безопасности',
      },
    },
  },
  { versionKey: false },
);

// Чтобы при POST-запросе при логине сервер
// нам не отправлял пароль вместе с остальными данными о пользователе
userSchema.methods.toJSON = function delUserPassword() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
