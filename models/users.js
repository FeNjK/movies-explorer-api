const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
      },
      message: 'Неправильный формат почты',
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Требуется ввести пароль'],
      select: false, // эту настройку включать только после проверки хэширования
      validate: {
        validator: validator.isStrongPassword,
      },
      message: 'Ваш пароль не удовлетворяет требования безопасности',
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
