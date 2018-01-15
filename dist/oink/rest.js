const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const { checkPassword } = require('./auth');

const errors = {
  login: 'Method POST::auth() takes two parameters: login[string] and pass[string].',
};

const rest = ((db, acl) => {
  const r = express.Router();
  r.use(bodyParser({ extended: true }));
  r.use(fileUpload());
  r.post('/login', async (req, res) => {
    if (req.body.login && req.body.pass) {
      db.get('users').findOne({ login: req.body.login }).then((user) => {
        if (user) {
          const isPasswordCorrect = checkPassword(req.body.pass, user.password, user.salt);
          if (isPasswordCorrect) {
            req.session.userId = user._id;
          }
          res.send({
            success: isPasswordCorrect,
            user: {
              name: user.name,
              id: user._id,
            },
          });
        } else {
          res.send({ success: false });
        }
      }).catch(e => e);
    } else {
      res.status(400).send(errors.login);
    }
  });
  r.all('/login', (req, res) => {
    res.status(400).send(errors.login);
  });
  r.post('/upload-image/:objectId/:fieldId', (req, res) => {
    const imageName = `${req.params.objectId}_${req.params.fieldId}.${req.files.image.name.split('.').splice(-1)}`;
    req.files.image.mv(`./dist/public/front/images/upload/${imageName}`, (err) => {
      if (err) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
  });

  return r;
});

module.exports = rest;
