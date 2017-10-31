"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var graphqlHTTP = require("express-graphql");
var fs = require("fs");
var monk = require("monk");
var graphql_1 = require("./graphql");
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
                _this.setupGraphQL(db);
            });
        }
    }
    Oink.prototype.run = function (app, panelPath) {
        if (panelPath === void 0) { panelPath = '/manage'; }
        this.app = app;
        app.use(panelPath + '/public/', express_1.static('./dist/public'));
        app.all([panelPath + '/*', panelPath], function (req, res) {
            fs.readFile('./dist/index.html', function (e, f) {
                res.send(f ? f.toString() : e.stack);
            });
        });
        return app;
    };
    Oink.prototype.getDatabase = function () {
        return this.db;
    };
    Oink.prototype.setupGraphQL = function (db) {
        this.app.use('/graphql', graphqlHTTP(function (req) { return ({
            graphiql: true,
            pretty: true,
            schema: graphql_1.default(db),
        }); }));
    };
    return Oink;
}());
exports.default = Oink;
