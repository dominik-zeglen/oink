const bodyParser = require('body-parser');
const express = require('express');
const checkPassword = require('./auth').checkPassword;

const errors = {
  login: 'Method POST::auth() takes two parameters: login[string] and pass[string].'
};

const rest = ((db, acl) => {
  const r = express.Router();
  r.use(bodyParser({extended: true}));
  r.post('/login', async (req, res) => {
    console.log(req.body);
    if (req.body.login && req.body.pass) {
      db.get('users').findOne({login: req.body.login}).then((user) => {
        if (user) {
          const isPasswordCorrect = checkPassword(req.body.pass, user.password, user.salt);
          if (isPasswordCorrect) {
            req.session.userId = user._id;
          }
          res.send({
            success: isPasswordCorrect, user: {
              name: user.name,
              id: user._id,
            }
          });
        } else {
          res.send({success: false});
        }
      }).catch((e) => e);
    } else {
      res.status(400).send(errors.login);
    }
  });
  r.all('/login', (req, res) => {
    res.status(400).send(errors.login);
  });

  return r;
});

module.exports = rest;