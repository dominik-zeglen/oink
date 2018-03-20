const assert = require("assert");
const faker = require("faker");
const monk = require("monk");
const _ = require("lodash");

const objectModule = require("../dist/oink/core/object_modules");

const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
const db = monk(dbPath);

describe("Modules", () => {
  const moduleData = {
    name: faker.name.firstName(0),
    description: faker.random.word()
  };
  const moduleFieldData = _.times(3, () => ({
    displayName: faker.name.title(),
    type: "short"
  }));

  it("Create module", done => {
    objectModule
      .addModule(db, moduleData)
      .then(inserted => {
        assert.notEqual(inserted._id, undefined);
        moduleData._id = inserted._id;
        done();
      })
      .catch(err => console.log(err));
  });
  it("Getting module", done => {
    objectModule
      .getModule(db, moduleData._id)
      .then(fetched => {
        const keys = Object.keys(moduleData);
        keys.forEach((key, index) => {
          assert(moduleData[key], fetched[key]);
          if (index === keys.length - 1) {
            done();
          }
        });
      })
      .catch(err => done(err));
  });
  it("Getting module list", done => {
    objectModule
      .getModules(db)
      .then(fetched => {
        const moduleIds = fetched.map(m => String(m._id));
        assert.equal(moduleIds.includes(String(moduleData._id)), true);
        done();
      })
      .catch(err => done(err));
  });
  it("Adding fields to module", async () => {
    const result = await objectModule
      .addModuleFields(db, moduleData._id, moduleFieldData)
      .then(r => r.ok)
      .catch(err => err);
    assert.equal(result, true);
    moduleData.fields = moduleFieldData;
    return objectModule
      .getModule(db, moduleData._id)
      .then(fetched => {
        const keys = Object.keys(moduleData);
        keys.forEach(key => {
          if (key === "fields") {
            fetched[key].forEach((f, i) =>
              assert.equal(f.displayName, moduleData[key][i].displayName)
            );
          } else {
            assert.equal(String(moduleData[key]), String(fetched[key]));
          }
        });
        return true;
      })
      .catch(err => err);
  });
  it("Remove fields from module", async () => {
    const poppedField = objectModule.createModuleFields(moduleFieldData).pop();
    const result = await objectModule
      .removeModuleFields(db, moduleData._id, [poppedField.name])
      .then(r => r.ok)
      .catch(err => err);
    assert.equal(result, true);
    moduleData.fields = moduleFieldData;
    return objectModule
      .getModule(db, moduleData._id)
      .then(fetched => {
        const keys = Object.keys(moduleData);
        keys.forEach(key => {
          if (key === "fields") {
            fetched[key].forEach((f, i) =>
              assert.equal(f.displayName, moduleData[key][i].displayName)
            );
            delete moduleData.fields;
          } else {
            assert.equal(String(moduleData[key]), String(fetched[key]));
          }
        });
        return true;
      })
      .catch(err => err);
  });
  it("Updating module", async () => {
    const name = faker.name.firstName(1);
    return objectModule
      .updateModule(db, moduleData._id, { name })
      .then(fetched => {
        assert.equal(fetched, true);
        return objectModule.getModule(db, moduleData._id).then(fetchedAgain => {
          assert.equal(fetchedAgain.name, name);
        });
      });
  });
  it("Removing module", done => {
    objectModule.removeModule(db, moduleData._id).then(fetched => {
      assert.equal(fetched, true);
      done();
    });
  });

  after(() => db.close());
});
