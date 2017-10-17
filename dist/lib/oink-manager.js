"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var minimist = require("minimist");
var monk = require("monk");
var default_schema_1 = require("./default-schema");
var envValues = minimist(process.argv.slice(2));
var collections = [
    'modules',
    'fields',
    'objects',
    'containers',
];
(function () {
    var defaultSchema = default_schema_1.default();
    if (Object.keys(envValues).length > 1 || envValues._.length > 0) {
        if (envValues._.indexOf('create-db') >= 0) {
            if (Object.keys(envValues).indexOf('db') !== -1) {
                var db_1 = monk.default(envValues.db);
                collections.forEach(function (c) {
                    db_1.get(c).insert(defaultSchema[c]).then(function () {
                        console.log(c + ' inserted!');
                    }).catch(function () {
                        console.log(c + ' could not be inserted');
                    });
                    console.log(c);
                });
            }
            else {
                throw new Error('Missing database path');
            }
        }
        else {
            if (envValues._.indexOf('drop-db') >= 0) {
                if (Object.keys(envValues).indexOf('db') !== -1) {
                    var db_2 = monk.default(envValues.db);
                    collections.forEach(function (c) {
                        db_2.get(c).drop().then(function () {
                            console.log(c + ' dropped!');
                        }).catch(function () {
                            console.log(c + ' could not be dropped');
                        });
                        console.log(c);
                    });
                }
                else {
                    throw new Error('Missing database path');
                }
            }
            else {
                throw new Error('Missing valid arguments');
            }
        }
    }
    else {
        throw new Error('Missing valid arguments');
    }
    return true;
})();
