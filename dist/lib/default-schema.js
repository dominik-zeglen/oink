"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
exports.createDefaultSchema = function () {
    return {
        containers: [
            {
                created_at: helpers_1.currentDateTime(),
                description: 'A root of the containers\' tree',
                name: 'Root',
                parent_id: -1,
                visible: false,
            },
        ],
        fields: [
            {
                name: "Value",
            },
            {
                name: "Text",
            },
            {
                name: "Image",
            },
            {
                name: "File",
            },
        ],
    };
};
exports.default = exports.createDefaultSchema;
