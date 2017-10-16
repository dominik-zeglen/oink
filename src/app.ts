import * as express from 'express';
import * as http from 'http';

import Oink from './lib/Oink';

const app = express();
const httpServer = new http.Server(app);
const oink = new Oink('mongodb://localhost:27017/oink');

oink.run(app, '/manage');

httpServer.listen(8000);
