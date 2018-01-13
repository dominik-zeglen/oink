const assert = require('assert');
const faker = require('faker');
const monk = require('monk');
const _ = require('lodash');

const siteObject = require('../dist/oink/core/objects');
const objectModule = require('../dist/oink/core/object_modules');

const dbPath = process.env.MONGODB_PATH || 'mongodb://127.0.0.1:27017/oink';
const db = monk(dbPath);

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

describe('Objects', () => {
  before((done) => {
    objectModule.addModule(moduleData, db)
      .then((r) => {
        moduleData._id = r._id;
        moduleData.fields = r.fields;
        objectData.module = r._id;
        done();
      });
  });

  it('Add empty object', (done) => {
    siteObject.addObject(objectData, db).then((inserted) => {
      assert.notEqual(inserted._id, undefined);
      assert.notEqual(inserted.fields, undefined);
      objectData._id = inserted._id;
      done();
    }).catch(err => done(err));
  });

  it('Remove object', (done) => {
    siteObject.removeObject(objectData._id, db).then((fetchedData) => {
      assert.equal(fetchedData, true);
      done();
    }).catch(err => done(err));
  });

  it('Add object with fields', (done) => {
    objectData.fields = moduleData.fields.map(f => ({
      name: f.name,
      value: faker.lorem.words(3),
    }));
    siteObject.addObject(objectData, db).then((inserted) => {
      assert.notEqual(inserted._id, undefined);
      inserted.fields.forEach((f, i) => {
        assert.equal(f.name, objectData.fields[i].name);
        assert.equal(f.value, objectData.fields[i].value);
      });
      objectData._id = inserted._id;
      done();
    }).catch(err => done(err));
  });

  it('Get object', (done) => {
    siteObject.getObject(objectData._id, db).then((fetchedData) => {
      assert.equal(String(fetchedData._id), String(objectData._id));
      done();
    }).catch(err => done(err));
  });

  it('Get objects from container', (done) => {
    siteObject.getObjectsFromContainer('-1', db).then((fetchedData) => {
      assert.equal(String(fetchedData[0]._id), String(objectData._id));
      done();
    }).catch(err => done(err));
  });

  it('Update object', (done) => {
    objectData.name = faker.name.firstName(0);
    siteObject.updateObject(objectData._id, { name: objectData.name }, db)
      .then((hasUpdated) => {
        assert.equal(hasUpdated, true);
        siteObject.getObject(objectData._id, db).then((fetchedData) => {
          assert.equal(String(fetchedData.name), String(objectData.name));
          objectData.fields.forEach((f, i) => {
            assert.equal(f.name, fetchedData.fields[i].name);
            assert.equal(f.value, fetchedData.fields[i].value);
          });
          done();
        }).catch(err => done(err));
      }).catch(err => done(err));
  });

  it('Update object fields', (done) => {
    objectData.fields[1].value = faker.name.firstName(0);
    siteObject.updateObjectFields(objectData._id, [objectData.fields[1]], db)
      .then((hasUpdated) => {
        assert.equal(hasUpdated, true);
        siteObject.getObject(objectData._id, db).then((fetchedData) => {
          assert.equal(String(fetchedData.fields[1].value), String(objectData.fields[1].value));
          done();
        }).catch(err => done(err));
      }).catch(err => done(err));
  });

  after((done) => {
    siteObject.removeObject(objectData._id, db).then(() => {
      objectModule.removeModule(moduleData._id, db).then(() => db.close()).then(() => done());
    });
  });
});
