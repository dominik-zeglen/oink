export default `
  type Container {
    id: String!
    name: String!
    description: String!
    parent: Container,
    children: [Container]
    breadcrumb(last: Int): [Container]
    objects(moduleId: String): [Object]
    visible: Boolean
    createdAt: Int!
  }

  type Object {
    id: String!
    name: String!
    module: Module!
    parent: Container
    fields: [ObjectField]
    visible: Boolean
    createdAt: Int!
  }

  type ObjectField {
    displayName: String!
    name: String!
    type: String!
    value: String
  }

  type ModuleField {
    name: String!
    type: String!
  }

  type Module {
    id: String!
    name: String!
    description: String
    fields: [ModuleField]
    createdAt: Int!
  }

  type User {
    id: String!
    name: String!
    roles: [UserRole]
    createdAt: Int!
  }

  type UserRole {
    name: String!
    resources: [Resource]
  }

  type Resource {
    name: String!
    create: Boolean!
    read: Boolean!
    write: Boolean!
  }

  type Sort {
    field: String!
    order: Boolean
  }
`;
