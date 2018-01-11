const crypto = require('crypto');

function createPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('SHA512', salt).update(password);
  return {
    pass: hash.digest('hex'),
    salt,
  };
}

function checkPassword(password, realPassword, salt) {
  return crypto.createHmac('SHA512', salt).update(password).digest('hex') === realPassword;
}

module.exports = {
  createPassword,
  checkPassword,
};
