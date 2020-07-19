const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  user.find({})
    .then(
      (users) => res.send({ data: users }),
    )
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;

  user.find({ _id: `${id}` }, (err, result) => {
    if ((!result) || (result.length === 0)) {
      res.status(404).send({ message: `Пользователя с ID ${id} не существует.` });
    } else {
      res.send(result);
    }
  })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => user.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    // eslint-disable-next-line no-shadow
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.updateUserProfile = (req, res) => {
  if ((req.body.name) && (req.body.about)) {
    user.findOneAndUpdate(
      // eslint-disable-next-line no-underscore-dangle
      { _id: req.user._id },
      {
        $set: {
          // _id: ObjectId,
          name: req.body.name,
          about: req.body.about,
        },
      },
    )
      .then((obj) => {
        res.send(obj);
      })
      .catch((err) => res.status(500)
        .send({ message: `Произошла ошибка ${err}` }));
  } else {
    res
      .status(500)
      .send({
        message:
          'Тело запроса составлено с ошибкой, должно быть:'
          + '{"name":"string","about":"string"}',
      });
  }
};
module.exports.updateUserAvatar = (req, res) => {
  if (req.body.avatar) {
    user.findOneAndUpdate(
      // eslint-disable-next-line no-underscore-dangle
      { _id: req.user._id },
      {
        $set: {
          // _id: ObjectId,
          avatar: req.body.avatar,
        },
      },
    )
      .then((obj) => {
        res.send(obj);
      })
      .catch((err) => res.status(500)
        .send({ message: `Произошла ошибка ${err}` }));
  } else {
    res
      .status(500)
      .send({
        message:
          'Тело запроса составлено с ошибкой, должно быть:'
          + '{"avatar":"string"}',
      });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return user.findUserByCreds(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          'strongpassword',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: `${err}` });
    });
};
