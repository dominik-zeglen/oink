const assert = require('assert');
const _ = require('lodash');
const faker = require('faker');
const axios = require('axios');

const GRAPHQL_URL = 'http://localhost:8000/manage/graphql?';
const FIELD_TYPES = ['short', 'long'];

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

const newContainer = {};
const newModule = {};
const newObject = {};

describe('Containers', () => {
  const client = axios.create({
    baseUrl: GRAPHQL_URL,
    timeout: 2000,
  });

  it('Insert container', (done) => {
    const name = faker.name.title();
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
      console.log(err.response.data);
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
      console.log(err.response.data);
      done(err);
    });
  });
  it('Fetch just created container by parent_id', (done) => {
    const query = `
    {
      ContainerChildren(parentId: "-1") {
        _id
        name
      }
    }`;

    gQL(client, query).then((r) => {
      assert.notEqual(r.ContainerChildren.map(c => c._id).indexOf(newContainer._id), -1);
      done();
    }).catch((err) => {
      console.log(err.response.data);
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
      console.log(err.response.data);
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
      console.log(err.response.data);
      done(err);
    });
  });
});

describe('Modules', () => {
  const client = axios.create({
    baseUrl: GRAPHQL_URL,
    timeout: 2000,
  });

  it('Insert module', (done) => {
    const name = faker.name.title();
    const fields = _.times(Math.ceil(Math.random() * 10), () => ({
      displayName: faker.name.title(),
      name: faker.name.title(),
      type: FIELD_TYPES[Math.floor(Math.random() * FIELD_TYPES.length)],
    }));
    const fieldsQuery = fields.map(f => jsonStringify(f))
      .reduce((prev, curr) => `${prev}, ${curr}`);
    const description = faker.lorem.words(10);
    const query = `mutation { 
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
      console.log(err.response.data);
      done(err);
    });
  });
  it('Fetch just created module', (done) => {
    const query = `{ 
      Module(id: "${newModule._id}") { 
        _id 
        name 
        fields { 
          displayName 
          name 
          type 
        } 
      } 
    }`;

    gQL(client, query).then((r) => {
      jsonEqual(r.Module, newModule, done);
    }).catch((err) => {
      console.log(err.response.data);
      done(err);
    });
  });
  it('Remove just created module', (done) => {
    const query = `
    mutation { 
      RemoveModule(id: "${newModule._id}") 
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.RemoveModule, true);
      done();
    }).catch((err) => {
      console.log(err.response.data);
      done(err);
    });
  });
  it('Fetch just removed module', (done) => {
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
      console.log(err.response.data);
      done(err);
    });
  });
});
describe('Objects', () => {
  const client = axios.create({
    baseUrl: GRAPHQL_URL,
    timeout: 2000,
  });

  it('Insert object', (done) => {
    const containerName = faker.name.title();
    const newContainerQuery = `
    mutation {
      NewContainer(parentId: "-1",
                   name: "${containerName}")
    }`;

    gQL(client, newContainerQuery).then((r) => {
      newContainer._id = r.NewContainer;
      newContainer.name = containerName;

      const moduleName = faker.name.title();
      const moduleFields = _.times(Math.ceil(Math.random() * 10), () => ({
        displayName: faker.name.title(),
        name: faker.name.title(),
        type: FIELD_TYPES[Math.floor(Math.random() * FIELD_TYPES.length)],
      }));
      const fieldsQuery = moduleFields.map(f => jsonStringify(f))
        .reduce((prev, curr) => `${prev}, ${curr}`);
      const description = faker.lorem.words(10);
      const newModuleQuery = `
      mutation { 
        NewModule(name: "${moduleName}", 
                  fields: [ ${fieldsQuery} ], 
                  description: "${description}") 
      }`;

      gQL(client, newModuleQuery).then((r) => {
        newModule._id = r.NewModule;
        newModule.name = moduleName;
        newModule.fields = moduleFields;

        const name = faker.name.title();
        const fields = newModule.fields.map(f => ({
          name: f.name,
          value: faker.lorem.words(10),
        }));
        const objectFieldsString = fields.map(f => jsonStringify(f))
          .reduce((prev, curr) => `${prev}, ${curr}`);
        const newObjectQuery = `
        mutation { 
          NewObject(parentId: "${newContainer._id}", 
                    name: "${name}", 
                    module: "${newModule._id}", 
                    fields: [${objectFieldsString}]
          ) 
        }`;

        gQL(client, newObjectQuery).then((r) => {
          assert.notEqual(r.NewObject, null);
          newObject._id = r.NewObject;
          newObject.name = name;
          newObject.fields = fields;
          done();
        }).catch((err) => {
          console.log(err.response.data);
          done(err);
        });
      }).catch((err) => {
        console.log(err.response.data);
        done(err);
      });
    }).catch((err) => {
      console.log(err.response.data);
    });
  });
  it('Fetch just created object by parent_id', (done) => {
    const query = `{ 
      Objects(parentId: "${newContainer._id}") { 
        _id 
      } 
    }`;

    gQL(client, query).then((r) => {
      assert.notEqual(r.Objects.map(c => c._id).indexOf(newObject._id), -1);
      done();
    }).catch((err) => {
      console.log(err.response.data);
      done(err);
    });
  });
  it('Remove object', (done) => {
    const query = `
    mutation { 
      RemoveObject(id: "${newObject._id}") 
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.RemoveObject, true);
      done();
    }).catch((err) => {
      console.log(err.response.data);
      done(err);
    });
  });
  it('Fetch just removed object', (done) => {
    const query = `
    {
      Object(id: "${newObject._id}") {
        _id
        name
      }
    }`;

    gQL(client, query).then((r) => {
      assert.equal(r.Object, null);
      done();
    }).catch((err) => {
      console.log(err.response.data);
      done(err);
    });
  });
  after((done) => {
    const removeModuleQuery = `
    mutation {
      RemoveModule(id: "${newModule._id}")
    }`;

    gQL(client, removeModuleQuery).then((r) => {
      const removeContainerQuery = `
      mutation {
        RemoveContainer(id: "${newContainer._id}")
      }`;

      gQL(client, removeContainerQuery).then((r) => {
        done();
      }).catch((err) => {
        console.log(err.response.data);
        done(err);
      });
    }).catch((err) => {
      console.log(err.response.data);
      done(err);
    });
  });
});
