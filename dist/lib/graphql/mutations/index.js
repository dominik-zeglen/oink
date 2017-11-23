const containerMutation = require('./container');
const moduleMutation = require('./module');
const objectMutation = require('./object');

module.exports = ((db) => {
  return {
    ...containerMutation(db),
    ...moduleMutation(db),
    ...objectMutation(db),
  };
});
