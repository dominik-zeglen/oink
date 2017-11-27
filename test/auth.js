const assert = require('assert');
const auth = require('../dist/oink/auth');
const faker = require('faker');

describe('Password checking', () => {
  const name = faker.name.findName();
  const password = faker.random.uuid();
  let hashedPassword = null;
  let salt = null;

  it('Create password', (done) => {
    const out = auth.createPassword(password);
    hashedPassword = out.pass;
    salt = out.salt;
    const schema = ['pass', 'salt'];
    Object.keys(out).forEach((key, i) => {
      assert.equal(key, schema[i]);
    });
    schema.forEach((key, i) => {
      assert.equal(key, Object.keys(out)[i]);
    });
    done();
  });

  it('Compare passwords', (done) => {
    assert.equal(true, auth.checkPassword(password, hashedPassword, salt));
    done();
  });
});
