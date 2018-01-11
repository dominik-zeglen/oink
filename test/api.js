/* eslint no-underscore-dangle: 0 */
const assert = require('assert');
const request = require('request');
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
    }`.replace('\\' + '"', '"');

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
    const query = `query { 
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
    const query = 'mutation { RemoveModule(id: "%id%") }'
      .replace('%id%', `${newModule._id}`);
    const expected = true;
    request({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      form: {
        query,
      },
    }, (e, r, b) => {
      assert.equal(JSON.parse(b).data.RemoveModule, expected);
      done();
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
  it('Insert temporary container', (done) => {
    const name = faker.name.title();
    const mutation = 'mutation { NewContainer(parentId: "%id%", name: "%name%") }'
      .replace('%id%', `${root._id}`)
      .replace('%name%', `${name}`);
    request({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      form: {
        query: mutation,
      },
    }, (e, r, b) => {
      if (e) {
        done(new Error());
      } else {
        newContainer._id = JSON.parse(b).data.NewContainer;
        newContainer.name = name;
        done();
      }
    });
  });
  it('Insert module', (done) => {
    const name = faker.name.title();
    const fields = _.times(Math.ceil(Math.random() * 10), () => ({
      displayName: faker.name.title(),
      name: faker.name.title(),
      type: FIELD_TYPES[Math.floor(Math.random() * FIELD_TYPES.length)],
    }));
    const fields_query = fields.map(f => jsonStringify(f)).reduce((prev, curr) => `${prev}, ${curr}`);
    const description = faker.lorem.words(10);
    const mutation = `mutation { NewModule(name: "${name}", fields: [ ${fields_query} ], description: "${description}") }`.replace('\\' + '"', '"');
    request({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      form: {
        query: mutation,
      },
    }, (e, r, b) => {
      if (e) {
        done(e);
      } else {
        newModule._id = JSON.parse(b).data.NewModule;
        newModule.name = name;
        newModule.fields = fields;
        done();
      }
    });
  });
  it('Insert temporary object', (done) => {
    const name = faker.name.title();
    const fields = newModule.fields.map(f => ({
      name: f.name,
      value: faker.lorem.words(10),
    }));
    const fields_query = fields.map(f => jsonStringify(f)).reduce((prev, curr) => `${prev}, ${curr}`);
    const mutation = `mutation { 
                        NewObject(parentId: "${newContainer._id}", 
                                  name: "${name}", 
                                  module: "${newModule._id}", 
                                  fields: [${fields_query}]
                        ) 
                      }`;
    request({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      form: {
        query: mutation,
      },
    }, (e, r, b) => {
      _id = JSON.parse(b).data.NewObject;
      if (e) {
        done(new Error());
      } else {
        assert.notEqual(_id, null);
        newObject._id = _id;
        newObject.name = name;
        newObject.fields = fields;
        done();
      }
    });
  });
  it('Fetch just created object by parent_id', (done) => {
    const query = `query { Objects(parentId: "${newContainer._id}") { _id } }`;
    const expected = newObject._id;
    request({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      form: {
        query,
      },
    }, (e, r, b) => {
      const data = JSON.parse(b);
      if (data.errors) {
        console.log(data.errors);
        done(new Error('GraphQL error'));
      }
      assert.notEqual(data.data.Objects.map(c => c._id).indexOf(expected), -1);
      done();
    });
  });
  it('Remove just created module', (done) => {
    const query = 'mutation { RemoveModule(id: "%id%") }'
      .replace('%id%', `${newModule._id}`);
    const expected = true;
    request({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      form: {
        query,
      },
    }, (e, r, b) => {
      assert.equal(JSON.parse(b).data.RemoveModule, expected);
      done();
    });
  });
  it('Remove temporary object', (done) => {
    const query = 'mutation { RemoveObject(id: "%id%") }'
      .replace('%id%', `${newObject._id}`);
    const expected = true;
    request({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      form: {
        query,
      },
    }, (e, r, b) => {
      assert.equal(JSON.parse(b).data.RemoveObject, expected);
      done();
    });
  });
  it('Remove temporary container', (done) => {
    const query = 'mutation { RemoveContainer(id: "%id%") }'
      .replace('%id%', `${newContainer._id}`);
    const expected = true;
    request({
      url: GRAPHQL_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      form: {
        query,
      },
    }, (e, r, b) => {
      assert.equal(JSON.parse(b).data.RemoveContainer, expected);
      done();
    });
  });
});
