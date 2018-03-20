const mocha = require("mocha");
const assert = require("assert");
const monk = require("monk");
const { graphql } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");
const snapshot = require("snap-shot-it");

const graphqlConfig = require("../../dist/oink/graphql");

let db, schema;

describe("GraphQL container API", () => {
  before(() => {
    const dbPath = process.env.MONGODB_PATH || "mongodb://127.0.0.1:27017/oink";
    db = monk(dbPath);
    schema = makeExecutableSchema({
      typeDefs: graphqlConfig.schema,
      resolvers: graphqlConfig.resolvers
    });
  });

  it("can read basic container properties", async () => {
    const query = `
      {
        containers {
          _id
          name
          description
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
        containers {
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

  it("can read children containers properties", async () => {
    const query = `
      {
        containers {
          _id
          name
          children {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can read container breadcrumb", async () => {
    const query = `
      {
        containers {
          _id
          name
          parent {
            _id
            name
          }
          breadcrumb {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can limit container list count", async () => {
    const query = `
      {
        containers(paginateBy: 2) {
          _id
          name
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can paginate container list", async () => {
    const query = `
      {
        containers(paginateBy: 2, page: 1) {
          _id
          name
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can sort container list", async () => {
    const query = `
      {
        containers(sort: { field: "name", order: -1}) {
          _id
          name
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can limit container children list count", async () => {
    const query = `
      {
        containers {
          _id
          name
          children(paginateBy: 2) {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can paginate container children list", async () => {
    const query = `
      {
        containers {
          _id
          name
          children(paginateBy: 2, page: 1) {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can sort container children list", async () => {
    const query = `
      {
        containers {
          _id
          name
          children(sort: { field: "name", order: -1}) {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("shows only visible containers by default", async () => {
    const query = `
      {
        containers {
          _id
          name
          visible
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can show all visible and hidden containers", async () => {
    const query = `
      {
        containers(showHidden: true) {
          _id
          name
          visible
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can limit container children object list count", async () => {
    const query = `
      {
        containers {
          _id
          name
          objects(paginateBy: 2) {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can paginate container children object list", async () => {
    const query = `
      {
        containers {
          _id
          name
          objects(paginateBy: 2, page: 1) {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can sort container children object list", async () => {
    const query = `
      {
        containers {
          _id
          name
          objects(sort: { field: "name", order: -1}) {
            _id
            name
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("shows only visible children objects by default", async () => {
    const query = `
      {
        containers {
          _id
          name
          children {
            _id
            name
            visible
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can show all visible and hidden children objects", async () => {
    const query = `
      {
        containers {
          _id
          name
          children(showHidden: true) {
            _id
            name
            visible
          }
        }
      }
    `;
    const response = await graphql(schema, query, {}, { db });
    snapshot(response);
  });

  it("can read basic container properties given container's ID", async () => {
    const query = `
      {
        container(id: "5aad2319d55cb32376c1ade7") {
          _id
          name
          description
          createdAt
          visible
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
