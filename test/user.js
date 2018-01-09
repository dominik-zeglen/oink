const assert = require('assert');
const faker = require('faker');
const monk = require('monk');

const user = require('../dist/oink/core/user');

const dbPath = process.env.MONGODB_PATH || 'mongodb://127.0.0.1:27017/oink';
const db = monk(dbPath);

describe('Users', () => {
  const userData = {
    name: faker.name.firstName(0),
    login: faker.random.word(),
    pass: faker.internet.password(),
  };

  it('Create user', (done) => {
    user.addUser(userData, db).then((inserted) => {
      assert.notEqual(inserted._id, undefined);
      userData._id = inserted._id;
      done();
    }).catch(err => done(err));
  });

  it('Getting user', (done) => {
    user.getUser(userData._id, db).then((fetched) => {
      const keys = Object.keys(userData);
      keys.forEach((key, index) => {
        if (key !== 'pass') {
          assert(userData[key], fetched[key]);
        }
        if (index === keys.length - 1) {
          done();
        }
      });
    }).catch(err => done(err));
  });

  it('Getting user list', (done) => {
    user.getUsers(db).then((fetchedList) => {
      const filteredList = fetchedList.filter(o => String(o._id) === String(userData._id));
      assert.equal(filteredList.length, 1);
      const keys = Object.keys(userData);
      keys.forEach((key, index) => {
        if (key !== 'pass') {
          assert(userData[key], filteredList[0][key]);
        }
        if (index === keys.length - 1) {
          done();
        }
      });
    }).catch(err => done(err));
  });

  it('Removing user', (done) => {
    user.removeUser(userData._id, db).then((fetched) => {
      assert.equal(fetched.result.ok, 1);
      done();
    });
  });

  after(() => db.close());
});
