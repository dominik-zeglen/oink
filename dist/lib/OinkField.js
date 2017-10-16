"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OinkField = /** @class */ (function () {
    function OinkField(field) {
        var _this = this;
        this.getName = function () {
            return _this.name;
        };
        this.name = field.name;
    }
    return OinkField;
}());
exports.OinkField = OinkField;
