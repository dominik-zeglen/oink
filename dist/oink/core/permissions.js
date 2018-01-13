async function addPermission(roleData, acl) {
  return acl.allow(roleData.name, roleData.resource, roleData.permissions);
}

async function removePermission(roleData, acl) {
  return acl.removeAllow(roleData.name, roleData.resource, roleData.permissions);
}

module.exports = {
  addPermission,
  removePermission,
};
