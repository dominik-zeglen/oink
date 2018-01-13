const assert = require('assert');
const faker = require('faker');
const monk = require('monk');
const _ = require('lodash');

const container = require('../dist/oink/core/container');

const dbPath = process.env.MONGODB_PATH || 'mongodb://127.0.0.1:27017/oink';
const db = monk(dbPath);

describe('Containers', () => {
  const containerData = {
    name: faker.name.firstName(0),
    description: faker.random.word(),
    parentId: '-1',
    visible: true,
  };
  const containerChildData = {
    name: faker.name.firstName(0),
    description: faker.random.word(),
    visible: true,
  };

  it('Create container', (done) => {
    container.addContainer(containerData, db).then((inserted) => {
      assert.notEqual(inserted._id, undefined);
      containerData._id = inserted._id;
      containerChildData.parentId = inserted._id;
      done();
    }).catch(err => done(err));
  });
  it('Getting container', (done) => {
    container.getContainer(containerData._id, db).then((fetched) => {
      const keys = Object.keys(containerData);
      keys.forEach((key, index) => {
        assert(containerData[key], fetched[key]);
        if (index === keys.length - 1) {
          done();
        }
      });
    }).catch(err => done(err));
  });
  it('Getting container children', async () => {
    containerChildData._id = await container.addContainer(containerChildData, db)
      .then(r => r._id);

    return container.getContainerChildren(containerData._id, db).then((fetched) => {
      assert.equal(fetched.map(o => String(o._id))
        .includes(String(containerChildData._id)), true);
    });
  });
  it('Getting container ancestors', async () => {
    return container.getContainerAncestors(containerChildData._id, db).then((fetched) => {
      assert.equal(fetched.map(o => String(o._id))
        .includes(String(containerData._id)), true);
      assert.equal(fetched.map(o => String(o._id))
        .includes(String(containerChildData._id)), true);
    });
  });
  it('Updating container', async () => {
    const name = faker.name.firstName(1);
    return container.updateContainer(containerData._id, { name }, db).then((fetched) => {
      assert.equal(fetched, true);
      return container.getContainer(containerData._id, db).then((fetchedAgain) => {
        assert.equal(fetchedAgain.name, name);
      });
    });
  });
  it('Removing container', (done) => {
    container.removeContainer(containerData._id, db)
      .then((fetched) => {
        assert.equal(fetched, true);
        done();
      });
  });

  after(() => {
    container.removeContainer(containerChildData._id, db)
      .then(() => db.close());
  });
});
