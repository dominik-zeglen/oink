const assert = require('assert');
const _ = require('lodash');
const faker = require('faker');
const graphql = require('graphql');
const mongo = require('mongodb');
const Acl = require('acl');
const monk = require('monk');

const objectModule = require('../dist/oink/core/object_modules');
const graphQLSchemaGen = require('../dist/oink/graphql');

const FIELD_TYPES = ['short', 'long'];

const dbPath = process.env.MONGODB_PATH || 'mongodb://127.0.0.1:27017/oink';
const db = monk(dbPath);
let acl;
let mongoClient;
let graphQLSchema;

function jsonStringify(objFromJson) {
  if (typeof objFromJson !== 'object' || Array.isArray(objFromJson)) {
    // not an object, stringify using native function
    return JSON.stringify(objFromJson);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const props = Object
    .keys(objFromJson)
    .map(key => `${key}:${jsonStringify(objFromJson[key])}`)
    .join(',');
  return `{${props}}`;
}

const newContainer = {};
const newModule = {};

before(async () => {
  mongoClient = await mongo.connect(dbPath);
  acl = new Acl(new Acl.mongodbBackend(mongoClient, 'acl'));
  graphQLSchema = graphQLSchemaGen(db, acl);
});

describe('GraphQL: containers', () => {
  it('Insert container', (done) => {
    const name = faker.name.title();
    // language=GraphQL
    const query = `
    mutation {
      NewContainer(parentId: "-1", name: "${name}")
    }`;

    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.notEqual(r.data.NewContainer, null);
      newContainer._id = r.data.NewContainer;
      newContainer.name = name;
      done();
    }).catch(err => done(err));
  });
  it('Fetch just created container', (done) => {
    // language=GraphQL
    const query = `{
      Container(id: "${newContainer._id}") {
        _id
        name
      }
    }`;
    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.Container.name, newContainer.name);
      done();
    }).catch(err => done(err));
  });
  it('Fetch just created container by parentId', (done) => {
    // language=GraphQL
    const query = `{
      ContainerChildren(parentId: "-1") {
        _id
        name
      }
    }`;
    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.ContainerChildren.map(c => String(c._id))
        .includes(String(newContainer._id)), true);
      done();
    }).catch(err => done(err));
  });
  it('Remove just created container', (done) => {
    // language=GraphQL
    const query = `
    mutation {
      RemoveContainer(id: "${newContainer._id}")
    }`;

    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.RemoveContainer, true);
      done();
    }).catch(err => done(err));
  });
});
describe('GraphQL: modules', () => {
  it('Add module', (done) => {
    const name = faker.name.title();
    const fields = _.times(Math.ceil(Math.random() * 10), () => ({
      displayName: faker.name.title(),
      type: FIELD_TYPES[Math.floor(Math.random() * FIELD_TYPES.length)],
    }));
    const fieldsQuery = fields.map(f => jsonStringify(f))
      .reduce((prev, curr) => `${prev}, ${curr}`);
    const description = faker.lorem.words(10);
    // language=GraphQL
    const query = `
    mutation { 
      NewModule(name: "${name}", 
                fields: [ ${fieldsQuery} ], 
                description: "${description}") 
    }`;

    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      newModule._id = r.data.NewModule;
      newModule.name = name;
      newModule.fields = fields;
      done();
    }).catch(err => done(err));
  });
  it('Fetch just created module', (done) => {
    // language=GraphQL
    const query = `{ 
      Module(id: "${newModule._id}") { 
        _id 
        name 
        fields { 
          displayName 
          type 
        } 
      } 
    }`;

    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.Module.name, newModule.name);
      done();
    }).catch(err => done(err));
  });
  it('Remove just created module', (done) => {
    // language=GraphQL
    const query = `
    mutation { 
      RemoveModule(id: "${newModule._id}") 
    }`;

    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.RemoveModule, true);
      done();
    }).catch(err => done(err));
  });
  it('Fetch just removed module', (done) => {
    // language=GraphQL
    const query = `{
      Module(id: "${newModule._id}") {
        _id
        name
      }
    }`;

    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.Module, null);
      done();
    }).catch(err => done(err));
  });
});
describe('GraphQL: objects', () => {
  const moduleData = {
    name: faker.name.firstName(0),
    description: faker.random.word(),
    fields: _.times(3, () => ({
      displayName: faker.name.title(),
      type: 'short',
    })),
  };
  const objectData = {
    name: faker.name.firstName(1),
    parentId: '-1',
  };

  before((done) => {
    objectModule.addModule(moduleData, db)
      .then((r) => {
        moduleData._id = r._id;
        moduleData.fields = r.fields;
        objectData.module = r._id;
        done();
      });
  });

  it('Add object', (done) => {
    // language=GraphQL
    const query = `
      mutation {
        NewObject(
        parentId: "${objectData.parentId}", 
        name: "${objectData.name}", 
        module: "${moduleData._id}") {
          _id
          fields {
            name
            value
          }
        }
      }
    `;
    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.notEqual(r.data.NewObject._id, null);
      objectData._id = r.data.NewObject._id;
      objectData.fields = r.data.NewObject.fields;
      done();
    }).catch(err => done(err));
  });

  it('Update object', (done) => {
    const newName = faker.name.firstName(1);
    // language=GraphQL
    const query = `
      mutation {
        UpdateObject(id: "${objectData._id}", name: "${newName}")
      }
    `;
    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.UpdateObject, true);
      objectData.name = newName;
      done();
    }).catch(err => done(err));
  });

  it('Update object field', (done) => {
    const newValue = faker.name.firstName(0);
    // language=GraphQL
    const query = `
      mutation {
        UpdateObjectFields(id: "${objectData._id}", 
        fields: [
          { name: "${objectData.fields[0].name}", value: "{objectData.fields[0].value}" }
        ])
      }
    `;
    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.UpdateObjectFields, true);
      objectData.fields[0].value = newValue;
      done();
    }).catch(err => done(err));
  });

  it('Remove object', (done) => {
    // language=GraphQL
    const query = `
      mutation {
        RemoveObject(id: "${objectData._id}")
      }
    `;
    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.RemoveObject, true);
      done();
    }).catch(err => done(err));
  });

  after((done) => {
    objectModule.removeModule(moduleData._id, db).then(() => {
      db.close();
      mongoClient.close();
      done();
    }).catch(err => done(err));
  });
});
describe('GraphQL: users', () => {
  const userData = {
    name: faker.name.firstName(0),
    login: faker.name.firstName(0),
    pass: faker.internet.password(16),
  };

  it('Add user', (done) => {
    // language=GraphQL
    const query = `
      mutation {
        NewUser(name: "${userData.name}",
                login: "${userData.login}",
                pass: "${userData.pass}") 
        {
          _id
          login
          name
        }
      }
    `;
    console.log(query);
    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.NewUser.name, userData.name);
      userData._id = r.data.NewUser._id;
      done();
    }).catch(e => done(e));
  });
  it('Get user', (done) => {
    const query = `
      {
        User(id: "${userData._id}") {
          _id
          name
        }
      }
    `;
    graphql.graphql(graphQLSchema, query, {}).then((r) => {
      assert.equal(r.data.User._id, userData._id);
      assert.equal(r.data.User.name, userData.name);
      done();
    }).catch(e => done(e));
  });
  it('Get all users', (done) => {
    const query = `
      {
        Users {
          _id
          name
        }
      }
    `;
    graphql.graphql(graphQLSchema, query, {}).then((users) => {
      const user = users.data.Users.filter(u => u._id === userData._id)[0];
      assert.equal(user._id, userData._id);
      assert.equal(user.name, userData.name);
      done();
    }).catch(e => done(e));
  });
  it('Authenticates user', (done) => {
    const query = `
      {
        Auth(login: "${userData.login}"
             pass: "${userData.pass}")
      }
    `;
    console.log(query);
    graphql.graphql(graphQLSchema, query, {}).then((res) => {
      assert.equal(res.data.Auth, true);
      done();
    }).catch(e => done(e));
  });
  it('Does not authenticate user with bad password', (done) => {
    const query = `
      {
        Auth(login: "${userData.login}"
             pass: "${userData.pass}1")
      }
    `;
    graphql.graphql(graphQLSchema, query, {}).then((res) => {
      assert.equal(res.data.Auth, false);
      done();
    }).catch(e => done(e));
  });
  it('Remove user', (done) => {
    const query = `
      mutation {
        RemoveUser(id: "${userData._id}")
      }
    `;
    graphql.graphql(graphQLSchema, query, {}).then((res) => {
      assert.equal(res.data.RemoveUser, true);
      done();
    }).catch(e => done(e));
  });
});
