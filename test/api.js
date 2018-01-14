const assert = require('assert');
const _ = require('lodash');
const faker = require('faker');
const axios = require('axios');
const graphql = require('graphql');
const mongo = require('mongodb');
const Acl = require('acl');
const monk = require('monk');

const objectModule = require('../dist/oink/core/object_modules');
const graphQLSchemaGen = require('../dist/oink/graphql');

const GRAPHQL_URL = 'http://localhost:8000/manage/graphql?';
const FIELD_TYPES = ['short', 'long'];

const dbPath = process.env.MONGODB_PATH || 'mongodb://127.0.0.1:27017/oink';
const db = monk(dbPath);
let acl;
let mongoClient;
let graphQLSchema;

function jsonEqual(a, b, d) {
  _.isEqual(a, b) ? d() : d(new Error(`Comparison ${JSON.stringify(a)} 
  and 
  ${JSON.stringify(b)} failed.`));
}

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

function gQL(client, query) {
  return client({
    url: GRAPHQL_URL,
    method: 'POST',
    data: {
      query,
    },
  }).then(r => r.data.data);
}

function printGQLError(err) {
  if (err.response) {
    if (err.response.data) {
      console.log(err.response.data);
    } else {
      console.log(err.response);
    }
  } else {
    console.log(err);
  }
}

const newContainer = {};
const newModule = {};
const newObject = {};

before(async () => {
  mongoClient = await mongo.connect(dbPath);
  acl = new Acl(new Acl.mongodbBackend(mongoClient, 'acl'));
  graphQLSchema = graphQLSchemaGen(db, acl);
});

describe('GraphQL: containers', () => {
  const client = axios.create({
    baseUrl: GRAPHQL_URL,
    timeout: 2000,
  });

  it('Insert container', (done) => {
    const name = faker.name.title();
    // language=GraphQL
    const query = `
    mutation {
      NewContainer(parentId: "-1",
                   name: "${name}")
    }`;

    gQL(client, query).then((r) => {
      newContainer._id = r.NewContainer;
      newContainer.name = name;
      done();
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
  });
  it('Fetch just created container', (done) => {
    const query = `
    {
      Container(id: "${newContainer._id}") {
        _id
        name
      }
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.Container.name, newContainer.name);
      done();
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
  });
  it('Fetch just created container by parentId', (done) => {
    const query = `
    {
      ContainerChildren(parentId: "-1") {
        _id
        name
      }
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.ContainerChildren.map(c => String(c._id))
        .includes(String(newContainer._id)), true);
      done();
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
  });
  it('Remove just created container', (done) => {
    const query = `
    mutation {
      RemoveContainer(id: "${newContainer._id}")
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.RemoveContainer, true);
      done();
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
  });
  it('Fetch just removed container', (done) => {
    const query = `
    {
      Container(id: "${newContainer._id}") {
        _id
        name
      }
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.Container, null);
      done();
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
  });
});
describe('GraphQL: modules', () => {
  const client = axios.create({
    baseUrl: GRAPHQL_URL,
    timeout: 2000,
  });

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

    gQL(client, query).then((r) => {
      newModule._id = r.NewModule;
      newModule.name = name;
      newModule.fields = fields;
      done();
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
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

    gQL(client, query).then((r) => {
      jsonEqual(r.Module, newModule, done);
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
  });
  it('Remove just created module', (done) => {
    // language=GraphQL
    const query = `
    mutation { 
      RemoveModule(id: "${newModule._id}") 
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.RemoveModule, true);
      done();
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
  });
  it('Fetch just removed module', (done) => {
    // language=GraphQL
    const query = `
    {
      Module(id: "${newModule._id}") {
        _id
        name
      }
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.Module, null);
      done();
    }).catch((err) => {
      printGQLError(err);
      done(err);
    });
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
