const express = require('express');
const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/error');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
