import {Application, static as expressStatic} from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as fs from "fs";
import * as monk from 'monk';
import schema from './graphql';

export default class Oink {
  private mountPath: string;
  private db: any;
  private app: Application;

  constructor(dbPath: string, mountPath: string = '/manage') {
    if (!dbPath) {
      throw new Error('No database path specified');
    } else {
      this.mountPath = mountPath;
      this.db = monk.default(dbPath).then((db) => {
        this.setupGraphQL(db);
      });
    }
  }

  public run(app: Application, panelPath: string = '/manage') {
    this.app = app;
    app.use(panelPath + '/public/', expressStatic('./dist/public'));
    app.all([panelPath + '/*', panelPath], (req, res) => {
      fs.readFile('./dist/index.html', (e, f) => {
        res.send(f ? f.toString() : e.stack);
      });
    });
    return app;
  }

  public getDatabase() {
    return this.db;
  }

  private setupGraphQL(db) {
    this.app.use('/graphql', graphqlHTTP((req) => ({
      graphiql: true,
      pretty: true,
      schema: schema(db),
    })));
  }
}
