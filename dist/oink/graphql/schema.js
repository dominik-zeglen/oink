const typeDefs = require("./typedefs");

module.exports = [
  `
  ${typeDefs}

  type RootQuery {
    container(id: String!): Container
    containers(paginateBy: Int, page: Int, sort: SortInput, showHidden: Boolean): [Container]

    object(id: String!): Object
    
    modules(paginateBy: Int, page: Int, sort: SortInput): [Module]
    module(id: String!): Module

    users(paginateBy: Int, page: Int, sort: SortInput): [User]
    user(id: String!): User
  }

  type RootMutation {
    createContainer(parentId: String): Container
    updateContainer(id: String!, input: ContainerInput!): Container
    removeContainer(id: String!): Boolean

    createObject(parentId: String!, moduleId: String!): Object
    updateObject(id: String!, input: ObjectInput!): Object
    removeObject(id: String!): Boolean

    createModule: Module,
    updateModule(id: String!, input: ModuleInput!): Module
    removeModule(id: String!): Boolean

    createUser(id: String!, password: String!): User
    updateUser(id: String!, input: UserInput!): User
    loginUser(id: String!, password: String!): Boolean
    logoutUser: Boolean
  }

  schema {
   query: RootQuery,
   mutation: RootMutation
  }
`
];
