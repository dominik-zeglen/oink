import * as express from 'express';
import {readFile} from "fs";
import * as http from 'http';
import monk from 'monk';
import * as logger from 'morgan';
import {render} from 'pug';

import {Oink} from './lib/Oink';

const db = monk('mongodb://127.0.0.1:27017/oink');
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
