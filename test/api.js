var assert = require('assert');
var http = require('http');
var request = require('request');
var async = require('async');
var _ = require('lodash');
var faker = require('faker');

function jsonEqual(a, b, d) {
  _.isEqual(a, b) ? d() : d(new Error);
}

var graphql_url = 'http://localhost:8000/graphql?';

var fieldList = null;
var root = null;
var newContainer = {};
var newModule = {};
var newObject = {};

describe('Fields', function () {
  it('Fetch field list', function (done) {
    var query = 'query {\n Fields {\n _id\n name\n }\n }';
    var expected = [
      {name: 'Value'},
      {name: 'Text'},
      {name: 'Image'},
      {name: 'File'}
    ];
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
      fieldList = JSON.parse(b).data.Fields;
      jsonEqual(fieldList.map(function (f) {
        return {name: f.name};
      }), expected, done);
    });
  });
  it('Fetch one field', function (done) {
    var query = 'query {\n Field(id: "%id%") {\n _id\n name\n }\n }'
      .replace('%id%', fieldList[0]._id);
    var expected = fieldList[0].name;
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
      assert.equal(JSON.parse(b).data.Field.name, expected);
      done();
    });
  });
});
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
      assert.equal(data.data.ContainerChildren[0].name, expected);
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
    var name = faker.name.title();
    var mutation = 'mutation { NewModule(name: "%name%") }'
      .replace('%name%', '' + name);
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
        done(e);
      } else {
        newModule._id = JSON.parse(b).data.NewModule;
        newModule.name = name;
        done();
      }
    });
  });
  it('Fetch just created module', function (done) {
    var query = 'query { Module(id: "%id%") { name } }'
      .replace('%id%', '' + newModule._id);
    var expected = newModule.name;
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
      assert.equal(JSON.parse(b).data.Module.name, expected);
      done();
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
    var name = faker.name.title();
    var mutation = 'mutation { NewModule(name: "%name%") }'
      .replace('%name%', '' + name);
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
        done(e);
      } else {
        newModule._id = JSON.parse(b).data.NewModule;
        newModule.name = name;
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