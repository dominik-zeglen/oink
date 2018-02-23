import { buildSchema } from 'graphql-tools';

export default buildSchema`
  type Query {
    container(id: String!): Container
    containers(level: Int!): [Container]

    object(id: String!): Object
    
    modules: [Module]
    module(id: String!): Module

    user(id: String!): User
  }

  type Mutation {
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
`;
