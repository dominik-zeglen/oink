const express = require('express');
const readFile = require('fs').readFile;
const http = require('http');
const monk = require('monk');
const logger = require('morgan');
const render = require('pug').render;

const Oink = require('./lib');
const dbPath = process.env.MONGODB_PATH || 'mongodb://127.0.0.1:27017/oink';
const db = monk(dbPath);
const app = express();
const httpServer = new http.Server(app);
const oink = new Oink(app, db);

app.use(logger('dev'));
app.get('/', (req, res) => {
  readFile('./templates/index.pug', async (e, f) => {
    const content = await db.get('objects')
      .findOne({_id: "5a0e19ec43ea61623a2be4ee"})
      .then((r) => oink.toObject(r));
    res.send(render(f.toString(), {
      content,
    }));
  });
});

httpServer.listen(8000);
