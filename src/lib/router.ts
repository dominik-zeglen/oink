import {Router, static as expressStatic} from 'express';
import graphqlHTTP = require('express-graphql');
import schema from './graphql';

const router = ((db, acl): Router => {
  const r = Router();
  r.use('/graphql', graphqlHTTP((req) => ({
    graphiql: true,
    pretty: true,
    schema: schema(db),
  })));
  r.use('/public/', expressStatic('./dist/public'));
  r.all(['/*', '/'], (req, res) => {
    res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Oink Manager</title>' +
      '<link href="/manage/public/css/oink.css" rel="stylesheet"><script src="/manage/public/js/oink.js">' +
      '</script></head><body><div id="oink-app"></div></body></html>');
  });

  return r;
});

export {
  router,
};
