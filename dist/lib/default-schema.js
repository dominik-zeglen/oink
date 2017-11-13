"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultSchema = function () {
    return {
        containers: [
            {
                created_at: +new Date(),
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
