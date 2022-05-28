const User = require('../models/user');
// const AuthorizationError = require('../errors/AuthorizationError');
// const ConflictError = require('../errors/ConflictError');
// const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с данным id не найден'));
      }
      return res.status(200).send({ _id: user._id, name, email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные профиля'));
      } else {
        next(err);
      }
    });
};

const getMe = (req, res, next) => {
  // const { _id } = req.user;
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с данным id не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  updateProfile,
  getMe,
};
