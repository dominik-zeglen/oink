import {Application} from 'express';
import * as graphqlHTTP from 'express-graphql';
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
        console.log('Connected to database');
        this.setupGraphQL(db);
      }).catch((e) => {
        console.log(e);
      });
    }
  }

  public run(app: Application, panelPath: string = '/manage') {
    this.app = app;
    app.all(panelPath, (req, res) => {
      res.send('<html><head><title>Oink! CMS</title></head><body><div id="oink-app"></div></body></html>');
    });
    return app;
  }

  private setupGraphQL(db) {
    this.app.use('/graphql', graphqlHTTP((req) => ({
      graphiql: true,
      pretty: true,
      schema: schema(db),
    })));
  }
}
