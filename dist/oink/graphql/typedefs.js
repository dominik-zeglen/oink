module.exports = `
  type Container {
    _id: String!
    name: String!
    description: String!
    parent: Container
    children(paginateBy: Int, page: Int, sort: SortInput, showHidden: Boolean): [Container]
    breadcrumb(last: Int): [Container]
    objects(paginateBy: Int, page: Int, sort: SortInput, showHidden: Boolean): [Object]
    visible: Boolean
    createdAt: Float!
  }

  type Object {
    _id: String!
    name: String!
    module: Module!
    parent: Container
    fields: [ObjectField]
    visible: Boolean
    createdAt: Float!
  }

  type ObjectField {
    name: String!
    value: String
  }

  type ModuleField {
    displayName: String!
    name: String!
    type: String!
  }

  type Module {
    _id: String!
    name: String!
    description: String
    fields: [ModuleField]
    createdAt: Float!
  }

  type User {
    _id: String!
    name: String!
    login: String!
    roles: [UserRole]
    createdAt: Float!
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
    remove: Boolean!
  }

  input ContainerInput {
    name: String
    description: String
    parent: String
    visible: Boolean
  }

  input ObjectInput {
    name: String
    parent: String
    visible: Boolean
    fields: [ObjectFieldInput]
  }

  input ObjectFieldInput {
    name: String
    value: String
  }

  input ModuleInput {
    name: String
    description: String
    fields: [ModuleFieldInput]
  }

  input ModuleFieldInput {
    name: String
    displayName: String
    type: String
  }

  input UserInput {
    name: String
    login: String
  }

  input SortInput {
    field: String!
    order: Int 
  }
`;
