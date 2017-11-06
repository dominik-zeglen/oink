const assert = require('assert');
const request = require('request');
const _ = require('lodash');
const faker = require('faker');

function jsonEqual(a, b, d) {
  _.isEqual(a, b) ? d() : d(new Error);
}
function jsonStringify(obj_from_json) {
  if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
    // not an object, stringify using native function
    return JSON.stringify(obj_from_json);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  let props = Object
    .keys(obj_from_json)
    .map(key => `${key}:${jsonStringify(obj_from_json[key])}`)
    .join(",");
  return `{${props}}`;
}

const graphql_url = 'http://localhost:8000/graphql?';
const fieldTypes = ['short', 'long'];

let root = null;
let newContainer = {};
let newModule = {};
let newObject = {};

describe('Containers', function () {
  it('Fetch root container', function (done) {
    var query = 'query {\n ContainerChildren {\n _id\n name\n }\n }'
      .replace('%id%', '' + -1);
    var expected = 'Root';
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      root = JSON.parse(b).data.ContainerChildren[0];
      assert.equal(root.name, expected);
      done();
    });
  });
  it('Fetch container by ID', function (done) {
    var query = 'query {\n Container(id: "%id%") {\n _id\n name\n }\n }'
      .replace('%id%', '' + root._id);
    var expected = 'Root';
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      assert.equal(JSON.parse(b).data.Container.name, expected);
      done();
    });
  });
  it('Insert container', function (done) {
    var name = faker.name.title();
    var mutation = 'mutation { NewContainer(parentId: "%id%", name: "%name%") }'
      .replace('%id%', '' + root._id)
      .replace('%name%', name);
    var expected = name;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: mutation
      }
    }, function (e, r, b) {
      if(e) {
        done(new Error());
      } else {
        newContainer._id = JSON.parse(b).data.NewContainer;
        newContainer.name = name;
        done();
      }
    });
  });
  it('Fetch just created container', function (done) {
    var query = 'query { Container(id: "%id%") { _id name } }'
      .replace('%id%', '' + newContainer._id);
    var expected = newContainer.name;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      assert.equal(JSON.parse(b).data.Container.name, expected);
      done();
    });
  });
  it('Fetch just created container by parent_id', function (done) {
    var query = 'query {\n ContainerChildren(parentId: "%id%") {\n _id\n name\n }\n }'
      .replace('%id%', '' + root._id);
    var expected = newContainer.name;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      const data = JSON.parse(b);
      if(data.errors) {
        console.log(data.errors);
        done(new Error('GraphQL error'));
      }
      assert.notEqual(data.data.ContainerChildren.map((c) => {
        return c.name;
      }).indexOf(expected), -1);
      done();
    });
  });
  it('Remove just created container', function (done) {
    var query = 'mutation { RemoveContainer(id: "%id%") }'
      .replace('%id%', '' + newContainer._id);
    var expected = true;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      assert.equal(JSON.parse(b).data.RemoveContainer, expected);
      done();
    });
  });
  it('Fetch just removed container', function (done) {
    var query = 'query { Container(id: "%id%") { _id name } }'
      .replace('%id%', '' + newContainer._id);
    var expected = null;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      assert.equal(JSON.parse(b).data.Container, expected);
      done();
    });
  });
});
describe('Modules', function () {
  it('Insert module', function (done) {
    const name = faker.name.title();
    const fields = _.times(Math.ceil(Math.random() * 10), () => {
      return {
        displayName: faker.name.title(),
        name: faker.name.title(),
        type: fieldTypes[Math.floor(Math.random() * fieldTypes.length)],
      };
    });
    const fields_query = fields.map((f) => jsonStringify(f)).reduce((prev, curr) => {
      return prev + ', ' + curr;
    });
    const description = faker.lorem.words(10);
    const mutation = `mutation { NewModule(name: "${name}", fields: [ ${fields_query} ], description: "${description}") }`.replace('\\' + '"', '"');
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: mutation
      }
    }, function (e, r, b) {
      if(e) {
        done(e);
      } else {
        newModule._id = JSON.parse(b).data.NewModule;
        newModule.name = name;
        newModule.fields = fields;
        done();
      }
    });
  });
  it('Fetch just created module', function (done) {
    const query = `query { Module(id: "${newModule._id}") { _id name fields { displayName name type } } }`;
    const expected = newModule;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      jsonEqual(JSON.parse(b).data.Module, expected, done);
    });
  });
  it('Remove just created module', function (done) {
    var query = 'mutation { RemoveModule(id: "%id%") }'
      .replace('%id%', '' + newModule._id);
    var expected = true;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      assert.equal(JSON.parse(b).data.RemoveModule, expected);
      done();
    });
  });
  it('Fetch just removed module', function (done) {
    var query = 'query { Module(id: "%id%") { _id name } }'
      .replace('%id%', '' + newModule._id);
    var expected = null;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      assert.equal(JSON.parse(b).data.Module, expected);
      done();
    });
  });
});
describe('Objects', function () {
  it('Insert temporary container', function (done) {
    var name = faker.name.title();
    var mutation = 'mutation { NewContainer(parentId: "%id%", name: "%name%") }'
      .replace('%id%', '' + root._id)
      .replace('%name%', '' + name);
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: mutation
      }
    }, function (e, r, b) {
      if(e) {
        done(new Error());
      } else {
        newContainer._id = JSON.parse(b).data.NewContainer;
        newContainer.name = name;
        done();
      }
    });
  });
  it('Insert module', function (done) {
    const name = faker.name.title();
    const fields = _.times(Math.ceil(Math.random() * 10), () => {
      return {
        displayName: faker.name.title(),
        name: faker.name.title(),
        type: fieldTypes[Math.floor(Math.random() * fieldTypes.length)],
      };
    });
    const fields_query = fields.map((f) => jsonStringify(f)).reduce((prev, curr) => {
      return prev + ', ' + curr;
    });
    const description = faker.lorem.words(10);
    const mutation = `mutation { NewModule(name: "${name}", fields: [ ${fields_query} ], description: "${description}") }`.replace('\\' + '"', '"');
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: mutation
      }
    }, function (e, r, b) {
      if(e) {
        done(e);
      } else {
        newModule._id = JSON.parse(b).data.NewModule;
        newModule.name = name;
        newModule.fields = fields;
        done();
      }
    });
  });
  it('Insert temporary object', function (done) {
    var name = faker.name.title();
    var mutation = 'mutation { NewObject(parentId: "%id%", name: "%name%", module: "%module%") }'
      .replace('%id%', '' + newContainer._id)
      .replace('%name%', '' + name)
      .replace('%module%', newModule.name);
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: mutation
      }
    }, function (e, r, b) {
      _id = JSON.parse(b).data.NewObject;
      if(e) {
        done(new Error());
      } else {
        assert.notEqual(_id, null);
        newObject._id = _id;
        newObject.name = name;
        done();
      }
    });
  });
  it('Remove temporary container', function (done) {
    var query = 'mutation { RemoveContainer(id: "%id%") }'
      .replace('%id%', '' + newContainer._id);
    var expected = true;
    request({
      url: graphql_url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      form: {
        query: query
      }
    }, function (e, r, b) {
      assert.equal(JSON.parse(b).data.RemoveContainer, expected);
      done();
    });
  });
});