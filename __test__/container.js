const assert = require("assert");
const faker = require("faker");
const monk = require("monk");
const _ = require("lodash");

const container = require("../dist/oink/core/containers");

const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
const db = monk(dbPath);

describe("Containers", () => {
  const containerData = {
    name: faker.name.firstName(0),
    description: faker.random.word(),
    parentId: "-1",
    visible: true
  };
  const containerChildData = {
    name: faker.name.firstName(0),
    description: faker.random.word(),
    visible: true
  };

  it("Create container", done => {
    container
      .addContainer(db, containerData)
      .then(inserted => {
        assert.notEqual(inserted._id, undefined);
        containerData._id = inserted._id;
        containerChildData.parentId = inserted._id;
        done();
      })
      .catch(err => done(err));
  });
  it("Getting container", done => {
    container
      .getContainer(db, containerData._id)
      .then(fetched => {
        const keys = Object.keys(containerData);
        keys.forEach((key, index) => {
          assert(containerData[key], fetched[key]);
          if (index === keys.length - 1) {
            done();
          }
        });
      })
      .catch(err => done(err));
  });
  it("Getting container children", async () => {
    containerChildData._id = await container
      .addContainer(db, containerChildData)
      .then(r => r._id);

    return container
      .getContainerChildren(db, containerData._id)
      .then(fetched => {
        assert.equal(
          fetched
            .map(o => String(o._id))
            .includes(String(containerChildData._id)),
          true
        );
      });
  });
  it("Getting container ancestors", async () => {
    return container
      .getContainerAncestors(db, containerChildData._id)
      .then(fetched => {
        assert.equal(
          fetched.map(o => String(o._id)).includes(String(containerData._id)),
          true
        );
        assert.equal(
          fetched
            .map(o => String(o._id))
            .includes(String(containerChildData._id)),
          true
        );
      });
  });
  it("Updating container", async () => {
    const name = faker.name.firstName(1);
    return container
      .updateContainer(db, containerData._id, { name })
      .then(fetched => {
        assert.equal(fetched, true);
        return container
          .getContainer(db, containerData._id)
          .then(fetchedAgain => {
            assert.equal(fetchedAgain.name, name);
          });
      });
  });
  it("Removing container", done => {
    container.removeContainer(db, containerData._id).then(fetched => {
      assert.equal(fetched, true);
      done();
    });
  });

  after(() => {
    container
      .removeContainer(db, containerChildData._id)
      .then(() => db.close());
  });
});
