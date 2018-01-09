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

async function resolveIfAllowed(root, params, options) {
  const hasPermission = await this.acl.isAllowed(this.userId, this.resource.name, this.resource.permission)
    .then(r => r)
    .catch(() => false);
  return hasPermission ? this.output(root, params, options) : new Error('No access for this resource');
}

module.exports = {
  createPassword,
  checkPassword,
  resolveIfAllowed,
};
