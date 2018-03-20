const mocha = require("mocha");
const assert = require("assert");
const monk = require("monk");
const { graphql } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");
const snapshot = require("snap-shot-it");
const mongodb = require("mongodb");
const Acl = require("acl");

const graphqlConfig = require("../../dist/oink/graphql");

let db, schema, acl;

describe("GraphQL object API", () => {
  before(async () => {
    const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
    db = monk(dbPath);
    const mongoClient = await mongodb.connect(dbPath);
    acl = new Acl(new Acl.mongodbBackend(mongoClient, "acl"));
    schema = makeExecutableSchema({
      typeDefs: graphqlConfig.schema,
      resolvers: graphqlConfig.resolvers
    });
  });

  it("can read user list", async () => {
    const query = `
      {
        users {
          _id
          login
          name
          createdAt
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db, acl });
    snapshot(response);
  });

  it("can limit user list count", async () => {
    const query = `
      {
        users(paginateBy: 5) {
          _id
          login
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db, acl });
    snapshot(response);
  });

  it("can paginate user list", async () => {
    const query = `
      {
        users(paginateBy: 5, page: 1) {
          _id
          login
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db, acl });
    snapshot(response);
  });

  it("can sort user list", async () => {
    const query = `
      {
        users(sort: { field: "login", order: -1 }) {
          _id
          login
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db, acl });
    snapshot(response);
  });

  it("can read user properties given user's ID", async () => {
    const query = `
      {
        user(id: "5ab0702d1d8ca823c2bae073") {
          _id
          login
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db, acl });
    snapshot(response);
  });

  it("can read user roles given user's ID", async () => {
    const query = `
      {
        user(id: "5ab0702d1d8ca823c2bae073") {
          _id
          login
          roles {
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db, acl });
    snapshot(response);
  });

  it("can read user roles' resources and permissions given user's ID", async () => {
    const query = `
      {
        user(id: "5ab0702d1d8ca823c2bae073") {
          _id
          login
          roles {
            name
            resources {
              name
              create
              read
              write
              remove
            }
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db, acl });
    snapshot(response);
  });

  after(() => {
    db.close();
  });
});
