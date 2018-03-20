const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const session = require("express-session");
const { makeExecutableSchema } = require("graphql-tools");
const graphqlConfig = require("./graphql");
const rest = require("./rest");
const bodyParser = require("body-parser");

function updateSessionData(data) {
  this.req.session = Object.assign(this.req.session, data);
}
function getSessionData() {
  return this.req.session;
}

const router = (db, acl) => {
  const r = express.Router();
  const schema = makeExecutableSchema({
    typeDefs: graphqlConfig.schema,
    resolvers: graphqlConfig.resolvers
  });
  r.use(
    session({
      secret: process.env.SESSION_SECRET || "notreallysecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        secure: false
      }
    })
  );
  r.use("/rest", rest(db, acl));
  r.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress({
      context: {
        db,
        acl
      },
      schema
    })
  );
  r.use("/graphiql", graphiqlExpress({ endpointURL: "/manage/graphql" }));
  r.use("/public/", express.static("./dist/public/oink"));
  r.all(["/*", "/"], (req, res) => {
    res.send(
      '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Oink Manager</title>' +
        '<script defer src="/manage/public/oink.js">' +
        '</script></head><body><div id="oink-app"></div></body></html>'
    );
  });
  return r;
};

module.exports = router;
