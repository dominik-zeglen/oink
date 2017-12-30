const cookieParser = require('cookie-parser');
const makeFields = require('./helpers').makeFields;
const Acl = require('acl');
const router = require('./router');
const mongodb = require('mongodb');

class Oink {
  constructor(app, db) {
    this.app = app;
    this.app.use(cookieParser());
    mongodb.connect(process.env.MONGODB_PATH || db._connectionURI, (e, dbMongo) => {
      this.acl = new Acl(new Acl.mongodbBackend(dbMongo, 'acl'));
      this.acl.allow([
        {
          allows: [
            {resources: 'graphql', permissions: '*'},
          ],
          roles: ['superadmin'],
        },
        {
          allows: [
            {resources: 'graphql', permissions: 'query'},
          ],
          roles: ['user'],
        }
      ]).then(() => {
        this.app.use('/manage', router(db, this.acl));
      });
    });
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
            created_at: f.created_at
          };
        });
      } else {
        if (o.fields) {
          return {
            fields: makeFields(o.fields),
            id: o._id,
            module: o.module,
            name: o.name,
            parent: o.parent_id,
            created_at: o.created_at
          };
        } else {
          return e;
        }
      }
    } else {
      return e;
    }
  }
}

module.exports = Oink;
