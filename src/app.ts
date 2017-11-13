import * as express from 'express';
import * as http from 'http';
import * as logger from 'morgan';

import Oink from './lib/Oink';

const app = express();
const httpServer = new http.Server(app);
const oink = new Oink('mongodb://127.0.0.1:27017/oink');

oink.run(app, '/manage');
app.use(logger('dev'));

httpServer.listen(8000);
