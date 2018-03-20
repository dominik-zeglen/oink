const mocha = require("mocha");
const assert = require("assert");
const monk = require("monk");
const { graphql } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");
const snapshot = require("snap-shot-it");

const graphqlConfig = require("../../dist/oink/graphql");

let db, schema;

describe("GraphQL module API", () => {
  before(() => {
    const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
    db = monk(dbPath);
    schema = makeExecutableSchema({
      typeDefs: graphqlConfig.schema,
      resolvers: graphqlConfig.resolvers
    });
  });

  it("can read module list", async () => {
    const query = `
      {
        modules {
          _id
          name
          description
          fields {
            name
            displayName
            type
          }
          createdAt
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can limit module list count", async () => {
    const query = `
      {
        modules(paginateBy: 2) {
          _id
          name
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can paginate module list", async () => {
    const query = `
      {
        modules(paginateBy: 2, page: 1) {
          _id
          name
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can sort module list", async () => {
    const query = `
      {
        modules(sort: { field: "name", order: -1 }) {
          _id
          name
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can read module properties given module's ID", async () => {
    const query = `
      {
        module(id: "5aad2319d55cb32376c1ae04") {
          _id
          name
          description
          fields {
            name
            displayName
            type
          }
          createdAt
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  after(() => {
    db.close();
  });
});
