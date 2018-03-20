const mocha = require("mocha");
const assert = require("assert");
const monk = require("monk");
const { graphql } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");
const snapshot = require("snap-shot-it");

const graphqlConfig = require("../../dist/oink/graphql");

let db, schema;

describe("GraphQL object API", () => {
  before(() => {
    const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
    db = monk(dbPath);
    schema = makeExecutableSchema({
      typeDefs: graphqlConfig.schema,
      resolvers: graphqlConfig.resolvers
    });
  });

  it("can read basic object properties", async () => {
    const query = `
      {
        object(id: "5aad2319d55cb32376c1ae65") {
          _id
          name
          fields {
            name
            value
          }
          createdAt
          visible
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can read parent container properties", async () => {
    const query = `
      {
        object(id: "5aad2319d55cb32376c1ae65") {
          _id
          name
          parent {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can read module properties", async () => {
    const query = `
      {
        object(id: "5aad2319d55cb32376c1ae65") {
          _id
          name
          module {
            _id
            name
          }
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
