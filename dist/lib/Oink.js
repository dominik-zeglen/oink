const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql');
const makeFields = require('./helpers').makeFields;
const Acl = require('acl');
const router = require('./router');
const mongodb = require('mongodb');

class Oink {
  constructor(app, db) {
    this.app = app;
    connect(db._connectionURI, (e, dbMongo) => {
      this.acl = new Acl(new Acl.mongodbBackend(dbMongo, '_acl'));
      this.acl.allow([
        {
          allows: [
            {resources: 'panel', permission: 'login'},
          ],
          roles: ['user'],
        },
        {
          allows: [
            {resources: 'panel', permission: '*'},
          ],
          roles: ['superadmin'],
        },
      ]);
    });
    this.app.use('/manage', router(db, this.acl));
  }

  toObject(o) {
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

module.exports = Oink;
