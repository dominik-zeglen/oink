import {Application, static as expressStatic} from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from './graphql';
import {makeFields} from "./helpers";

class Oink {
  private mountPath: string;
  private app: Application;

  constructor(app: Application, db: any) {
    this.app = app;
    this.mountPath = '/manage';
    app.use(this.mountPath + '/public/', expressStatic('./dist/public'));
    app.all([this.mountPath + '/*', this.mountPath], (req, res) => {
      res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Oink Manager</title>' +
        '<link href="/manage/public/css/oink.css" rel="stylesheet"><script src="/manage/public/js/oink.js">' +
        '</script></head><body><div id="oink-app"></div></body></html>');
    });
    this.setupGraphQL(db);
  }

  public toObject(o) {
    const e = new Error('Given object is not OinkObject');
    if (o) {
      if (o[0] && o[0].fields) {
        return o.map((f) => {
          return {
            fields: makeFields(f.fields),
            id: f._id,
            module: f.module,
            name: f.name,
            parent: f.parent_id,
          };
        });
      } else {
        if (o.fields) {
          return {
            fields: makeFields(o.fields),
            id: o._id,
            module: o.module,
            parent: o.parent_id,
          };
        } else {
          return e;
        }
      }
    } else {
      return e;
    }
  }

  private setupGraphQL(db) {
    this.app.use('/graphql', graphqlHTTP((req) => ({
      graphiql: true,
      pretty: true,
      schema: schema(db),
    })));
  }
}

export {
  Oink,
};
