const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dbUrl = 'mongodb://localhost:27017/mestodb';
const routeToCards = require('./routes/cards');
const routeToUsers = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./midllewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', routeToUsers, routeToCards);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`App listening on port ${PORT}`);
});
