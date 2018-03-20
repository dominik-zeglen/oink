const assert = require("assert");
const faker = require("faker");
const monk = require("monk");
const _ = require("lodash");

const siteObject = require("../dist/oink/core/objects");
const objectModule = require("../dist/oink/core/object_modules");

const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
const db = monk(dbPath);

const moduleData = {
  name: faker.name.firstName(0),
  description: faker.random.word(),
  fields: _.times(3, () => ({
    displayName: faker.name.title(),
    type: "short"
  }))
};

const objectData = {
  name: faker.name.firstName(1),
  parentId: "-1",
  visible: true
};

describe("Objects", () => {
  before(done => {
    objectModule.addModule(db, moduleData).then(r => {
      moduleData._id = r._id;
      moduleData.fields = r.fields;
      objectData.module = r._id;
      done();
    });
  });

  it("Add empty object", done => {
    siteObject
      .addObject(db, objectData)
      .then(inserted => {
        assert.notEqual(inserted._id, undefined);
        assert.notEqual(inserted.fields, undefined);
        objectData._id = inserted._id;
        done();
      })
      .catch(err => done(err));
  });

  it("Remove object", done => {
    siteObject
      .removeObject(db, objectData._id)
      .then(isRemoved => {
        assert.equal(isRemoved, true);
        siteObject
          .getObject(db, objectData._id)
          .then(fetchedData => {
            assert.equal(fetchedData, null);
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it("Add object with fields", done => {
    objectData.fields = moduleData.fields.map(f => ({
      name: f.name,
      value: faker.lorem.words(3)
    }));
    siteObject
      .addObject(db, objectData)
      .then(inserted => {
        assert.notEqual(inserted._id, undefined);
        inserted.fields.forEach((f, i) => {
          assert.equal(f.name, objectData.fields[i].name);
          assert.equal(f.value, objectData.fields[i].value);
        });
        objectData._id = inserted._id;
        done();
      })
      .catch(err => done(err));
  });

  it("Get object", done => {
    siteObject
      .getObject(db, objectData._id)
      .then(fetchedData => {
        assert.equal(String(fetchedData._id), String(objectData._id));
        done();
      })
      .catch(err => done(err));
  });

  it("Get objects from container", done => {
    siteObject
      .getObjectsFromContainer(db, "-1")
      .then(fetchedData => {
        assert.equal(String(fetchedData[0]._id), String(objectData._id));
        done();
      })
      .catch(err => done(err));
  });

  it("Update object", done => {
    objectData.name = faker.name.firstName(0);
    siteObject
      .updateObject(db, objectData._id, { name: objectData.name })
      .then(hasUpdated => {
        assert.equal(hasUpdated, true);
        siteObject
          .getObject(db, objectData._id)
          .then(fetchedData => {
            assert.equal(String(fetchedData.name), String(objectData.name));
            objectData.fields.forEach((f, i) => {
              assert.equal(f.name, fetchedData.fields[i].name);
              assert.equal(f.value, fetchedData.fields[i].value);
            });
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it("Update object fields", done => {
    objectData.fields[1].value = faker.name.firstName(0);
    siteObject
      .updateObjectFields(db, objectData._id, [objectData.fields[1]])
      .then(hasUpdated => {
        assert.equal(hasUpdated, true);
        siteObject
          .getObject(db, objectData._id)
          .then(fetchedData => {
            assert.equal(
              String(fetchedData.fields[1].value),
              String(objectData.fields[1].value)
            );
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  after(done => {
    siteObject.removeObject(db, objectData._id).then(() => {
      objectModule
        .removeModule(db, moduleData._id)
        .then(() => db.close())
        .then(() => done());
    });
  });
});
