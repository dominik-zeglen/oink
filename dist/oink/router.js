const express = require('express');
const graphqlHTTP = require('express-graphql');
const session = require('express-session');
const schema = require('./graphql');
const rest = require('./rest');

const router = ((db, acl) => {
  const r = express.Router();
  r.use(session({
    secret: process.env.SESSION_SECRET || 'notreallysecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
    }
  }));
  r.use('/rest', rest(db, acl));
  r.use('/graphql', graphqlHTTP((req) => ({
    graphiql: true,
    pretty: true,
    schema: schema(db, acl, req.session.userId),
  })));
  r.use('/public/', express.static('./dist/public'));
  r.all(['/*', '/'], (req, res) => {
    res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Oink Manager</title>' +
      '<link href="/manage/public/css/oink.css" rel="stylesheet"><script src="/manage/public/js/oink.js">' +
      '</script></head><body><div id="oink-app"></div></body></html>');
  });
  return r;
});

module.exports = router;