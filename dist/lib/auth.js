const crypto = require('crypto');

function createPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('SHA512', salt).update(password);
  return {
    pass: hash.digest('hex'),
    salt,
  };
}

module.exports = {
  createPassword
};