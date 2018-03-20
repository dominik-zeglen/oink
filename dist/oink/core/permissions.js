async function addPermission(acl, roleData) {
  await acl.allow(roleData.name, roleData.resources, roleData.permissions);
  return roleData;
}

async function removePermission(acl, roleData) {
  return acl.removeAllow(
    roleData.name,
    roleData.resources,
    roleData.permissions
  );
}

async function getRoleResources(acl, role) {
  return acl.whatResources(role);
}

const permissionTypes = ["create", "read", "write", "remove"];
const resources = ["content", "modules", "users"];

module.exports = {
  addPermission,
  permissionTypes,
  getRoleResources,
  removePermission,
  resources
};
