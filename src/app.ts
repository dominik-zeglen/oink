import * as express from 'express';
import {readFile} from "fs";
import * as http from 'http';
import * as logger from 'morgan';
import {render} from 'pug';
const db = require('monk')('mongodb://127.0.0.1:27017/oink');

import {Oink} from './lib/Oink';

const app = express();
const httpServer = new http.Server(app);
const oink = new Oink(app, db);

app.use(logger('dev'));
app.get('/', (req, res) => {
  readFile('./templates/index.pug', (e, f) => {
    let content = db.get('objects')
      .findOne({_id: "5a0e19ec43ea61623a2be4ee"})
      .then((r) => oink.toObject(r));
    res.send(render(f.toString(), {
      content,
    }));
  });
});

httpServer.listen(8000);
