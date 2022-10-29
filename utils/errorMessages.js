// For users controllers
const errorMessageNotFoundUser = 'Пользователь с указанным _id не найден.';
const errorMessageIncorrectUserDataSearch = 'Поиск осуществляется по некорректным данным.';
const errorMessageIncorrectUserDataCreation = 'Переданы некорректные данные при создании пользователя.';
const errorMessageUserDataDuplication = 'Пользователь с таким email уже существует.';
const errorMessageIncorrectUserDataEdition = 'Переданы некорректные данные при обновлении профиля.';
const errorMessageIncompleteUserData = 'Пожалуйста, заполните все поля ввода.';
const errorMessageUserAuthorizations = 'Произошла ошибка авторизации. Введите правильные логин и пароль.';
const errorMessageIncorrectId = 'Переданный _id объекта некорректен.';
const errorMessageNoUserToken = 'Отсутствует пользовательский токен.';

// For movies controllers
const errorMessageNotFoundMovie = 'Фильм не найден.';
const errorMessageIncorrectMovieDataSave = 'Переданы некорректные данные при cохранении фильма.';
const errorMessageMovieDataDuplication = 'Фильм с указанными данными уже добавлен.';
const errorMessageNoAccessDeleteMovie = 'Вы не можете удалить фильм, добавленный другим пользователем!';
const errorMessageIncorrectMovieDataForDelete = 'Передан некорректный _id фильма при удалении.';

// For server status
const errorMessageNotFoundResource = 'Ресурс не найден.';
const errorMessageBadConnection = 'Возникла ошибка в подключении к серверу.';
const internalServerError = 'Произошла внутренняя ошибка сервера.';

module.exports = {
  errorMessageNotFoundUser,
  errorMessageIncorrectUserDataSearch,
  errorMessageIncorrectUserDataCreation,
  errorMessageUserDataDuplication,
  errorMessageIncorrectUserDataEdition,
  errorMessageIncompleteUserData,
  errorMessageUserAuthorizations,
  errorMessageIncorrectId,
  errorMessageNoUserToken,
  errorMessageNotFoundMovie,
  errorMessageIncorrectMovieDataSave,
  errorMessageMovieDataDuplication,
  errorMessageNoAccessDeleteMovie,
  errorMessageIncorrectMovieDataForDelete,
  errorMessageNotFoundResource,
  errorMessageBadConnection,
  internalServerError,
};
