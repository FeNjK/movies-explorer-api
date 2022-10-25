const routerUser = require('express').Router();

const {
  getUserMe,
  editUserData,
} = require('../controllers/users');

const {
  userDataUpdateValidation,
} = require('../middlewares/validation');

routerUser.get('/users/me', getUserMe);
routerUser.patch('/users/me', userDataUpdateValidation, editUserData);

module.exports = routerUser;
