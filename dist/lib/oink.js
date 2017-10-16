"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monk = require("monk");
var Oink = /** @class */ (function () {
    function Oink(dbPath, mountPath) {
        if (mountPath === void 0) { mountPath = '/manage'; }
        if (!dbPath) {
            throw new Error('No database path specified');
        }
        else {
            this.mountPath = mountPath;
            this.db = monk.default(dbPath);
        }
    }
    Oink.prototype.expressMiddleware = function (req, res) {
        res.send('<html><head><title>Oink! CMS</title></head><body><div id="oink-app"></div></body></html>');
    };
    return Oink;
}());
exports.default = Oink;
