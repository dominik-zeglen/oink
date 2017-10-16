"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphqlHTTP = require("express-graphql");
var graphql_1 = require("graphql");
var monk = require("monk");
var graphql_2 = require("./graphql");
var Oink = /** @class */ (function () {
    function Oink(dbPath, mountPath) {
        if (mountPath === void 0) { mountPath = '/manage'; }
        var _this = this;
        if (!dbPath) {
            throw new Error('No database path specified');
        }
        else {
            this.mountPath = mountPath;
            this.db = monk.default(dbPath).then(function (db) {
                console.log('Connected to database');
                _this.setupGraphQL(db);
            }).catch(function (e) {
                console.log(e);
            });
        }
    }
    Oink.prototype.run = function (app, panelPath) {
        if (panelPath === void 0) { panelPath = '/manage'; }
        app.all(panelPath, function (req, res) {
            res.send('<html><head><title>Oink! CMS</title></head><body><div id="oink-app"></div></body></html>');
        });
        return app;
    };
    Oink.prototype.setupGraphQL = function (db) {
        // const fieldSchema = new GraphQLSchema({
        //   query: new GraphQLObjectType({
        //     fields: {
        //       name: {
        //         type: GraphQLString,
        //         resolve() {
        //           return db.get('fields').find().then((fields) => {
        //             return fields.map((c) => {
        //               return c.name;
        //             });
        //           });
        //         },
        //       },
        //     },
        //     name: 'Fields',
        //   }),
        // });
        this.app.use('/graphql', graphqlHTTP(function (req) { return ({
            schema: graphql_2.default,
            pretty: true,
            graphiql: true,
        }); }));
        graphql_1.graphql(graphql_2.default, '{ name }').then(function (res) {
            console.log(res);
        }).catch(function (e) {
            console.log(e);
        });
    };
    return Oink;
}());
exports.default = Oink;
