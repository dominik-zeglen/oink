const {
  getContainer,
  getContainerAncestors,
  getContainerChildren,
  getContainerList
} = require("../core/containers");
const { getModule, getModules } = require("../core/object_modules");
const { getObject, getObjectsFromContainer } = require("../core/objects");
const { getUser, getUsers, getUserRoles } = require("../core/users");
const { getRoleResources, permissionTypes } = require("../core/permissions");
const settings = require("../../../settings");

module.exports = {
  RootQuery: {
    container(obj, args, context) {
      return getContainer(context.db, args.id);
    },
    containers(obj, args, context) {
      const sort = args.sort ? { [args.sort.field]: args.sort.order } : null;
      return getContainerList(
        context.db,
        args.paginateBy,
        args.page,
        sort,
        args.showHidden
      );
    },
    modules(obj, args, context) {
      const sort = args.sort ? { [args.sort.field]: args.sort.order } : null;
      return getModules(context.db, args.paginateBy, args.page, sort);
    },
    module(obj, args, context) {
      return getModule(context.db, args.id);
    },
    object(obj, args, context) {
      return getObject(context.db, args.id);
    },
    users(obj, args, context) {
      const sort = args.sort ? { [args.sort.field]: args.sort.order } : null;
      return getUsers(context.db, args.paginateBy, args.page, sort);
    },
    user(obj, args, context) {
      return getUser(context.db, args.id);
    }
  },
  Container: {
    parent(container, args, context) {
      return getContainer(context.db, container.parentId);
    },
    children(container, args, context) {
      const sort = args.sort ? { [args.sort.field]: args.sort.order } : null;
      return getContainerChildren(
        context.db,
        container._id,
        args.paginateBy || settings.paginateBy,
        args.page || 0,
        sort,
        args.showHidden
      );
    },
    objects(container, args, context) {
      const sort = args.sort ? { [args.sort.field]: args.sort.order } : null;
      return getObjectsFromContainer(
        context.db,
        container._id,
        args.paginateBy,
        args.page,
        sort,
        args.showHidden
      );
    },
    breadcrumb(container, args, context) {
      return getContainerAncestors(context.db, container._id, args.last);
    }
  },
  Object: {
    module(object, args, context) {
      return getModule(context.db, object.module);
    },
    parent(object, args, context) {
      return getContainer(context.db, object.parentId);
    }
  },
  User: {
    async roles(user, args, context) {
      return (await getUserRoles(context.acl, user._id)).map(role => ({
        name: role
      }));
    }
  },
  UserRole: {
    async resources(role, args, context) {
      const resourceList = await getRoleResources(context.acl, role.name);
      return Object.keys(resourceList).map(key => {
        const permissions = permissionTypes.reduce((data, type) => {
          data[type] = resourceList[key].indexOf(type) !== -1;
          return data;
        }, {});
        return {
          name: key,
          ...permissions
        };
      });
    }
  }
};
