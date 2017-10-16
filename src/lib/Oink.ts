import {Application} from 'express';
import * as graphqlHTTP from 'express-graphql';
import {
  graphql, GraphQLEnumValue,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
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
    app.all(panelPath, (req, res) => {
      res.send('<html><head><title>Oink! CMS</title></head><body><div id="oink-app"></div></body></html>');
    });
    return app;
  }

  private setupGraphQL(db) {
    // const fieldSchema = new GraphQLSchema({
    //   query: new GraphQLObjectType({
    //     fields: {
    //       name: {
    //         type: GraphQLString,
    //         resolve() {
    //           return db.get('fields').find().then((fields) => {
    //             return fields.map((c) => {
    //               return c.name;
    //             });
    //           });
    //         },
    //       },
    //     },
    //     name: 'Fields',
    //   }),
    // });

    this.app.use('/graphql', graphqlHTTP((req) => ({
      schema: schema,
      pretty: true,
      graphiql: true,
    })));

    graphql(schema, '{ name }').then((res) => {
      console.log(res);
    }).catch((e) => {
      console.log(e);
    });
  }
}
