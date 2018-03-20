const assert = require("assert");
const faker = require("faker");
const monk = require("monk");
const mongo = require("mongodb");
const Acl = require("acl");
const _ = require("lodash");

const user = require("../dist/oink/core/users");
const permission = require("../dist/oink/core/permissions");

const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
const db = monk(dbPath);
let acl;
let mongoClient;

before(async () => {
  mongoClient = await mongo.connect(dbPath);
  acl = new Acl(new Acl.mongodbBackend(mongoClient, "acl"));
});

describe("Roles and permissions to resources", () => {
  const roleData = {
    name: faker.name.jobTitle(),
    resources: faker.commerce.department(),
    permissions: _.times(3, faker.hacker.verb)
  };

  it("Add role permission", done => {
    permission
      .addPermission(acl, roleData)
      .then(async () => {
        const shouldBeAllowed = await acl.areAnyRolesAllowed(
          roleData.name,
          roleData.resources,
          roleData.permissions
        );
        assert.equal(shouldBeAllowed, true);
        const shouldNotBeAllowed = await acl.areAnyRolesAllowed(
          roleData.name,
          roleData.resources,
          `not ${roleData.permissions[0]}`
        );
        assert.equal(shouldNotBeAllowed, false);
        done();
      })
      .catch(err => done(err));
  });
  it("Remove role permission", done => {
    permission
      .removePermission(acl, roleData)
      .then(async () => {
        const shouldNotBeAllowed = await acl.areAnyRolesAllowed(
          roleData.name,
          roleData.resource,
          roleData.permissions
        );
        assert.equal(shouldNotBeAllowed, false);
        done();
      })
      .catch(err => done(err));
  });
});

describe("Users", () => {
  const userData = {
    name: faker.name.firstName(0),
    login: faker.random.word(),
    password: faker.internet.password()
  };
  const roleData = {
    name: faker.name.jobTitle(),
    resources: faker.commerce.department(),
    permissions: _.times(3, faker.hacker.verb)
  };

  it("Create user", done => {
    user
      .addUser(db, userData)
      .then(inserted => {
        assert.notEqual(inserted._id, undefined);
        userData._id = inserted._id;
        done();
      })
      .catch(err => done(err));
  });
  it("Get user", done => {
    user
      .getUser(db, userData._id)
      .then(fetched => {
        const keys = Object.keys(userData);
        keys.forEach((key, index) => {
          if (key !== "pass") {
            assert(userData[key], fetched[key]);
          }
          if (index === keys.length - 1) {
            done();
          }
        });
      })
      .catch(err => done(err));
  });
  it("Get user list", done => {
    user
      .getUsers(db)
      .then(fetchedList => {
        const filteredList = fetchedList.filter(
          o => String(o._id) === String(userData._id)
        );
        assert.equal(filteredList.length, 1);
        const keys = Object.keys(userData);
        keys.forEach((key, index) => {
          if (key !== "pass") {
            assert(userData[key], filteredList[0][key]);
          }
          if (index === keys.length - 1) {
            done();
          }
        });
      })
      .catch(err => done(err));
  });
  it("Authenticate user", done => {
    user
      .authenticateUser(db, userData.login, userData.password)
      .then(res => {
        assert.equal(res, true);
        done();
      })
      .catch(e => done(e));
  });
  it("Does not authenticate user with wrong password", done => {
    user
      .authenticateUser(db, userData.login, `${userData.pass}-`)
      .then(res => {
        assert.equal(res, false);
        done();
      })
      .catch(e => done(e));
  });
  it("Add role to user", done => {
    permission
      .addPermission(acl, roleData)
      .then(() => {
        user
          .addUserRole(acl, userData._id, roleData.name)
          .then(() => {
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
  it("Get user roles", done => {
    user
      .getUserRoles(acl, userData._id)
      .then(roleList => {
        assert.equal(roleList[0], String(roleData.name));
        done();
      })
      .catch(err => done(err));
  });
  it("Remove role from user", done => {
    user
      .removeUserRole(acl, userData._id, roleData.name)
      .then(() => {
        user
          .isUserAllowed(
            acl,
            userData._id,
            roleData.resource,
            roleData.permissions[0]
          )
          .then(fetchedData => {
            assert.equal(fetchedData, false);
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
  it("Removing user", done => {
    user.removeUser(db, userData._id).then(fetched => {
      assert.equal(fetched.result.ok, 1);
      done();
    });
  });

  after(() => {
    db.close();
    mongoClient.close();
  });
});
