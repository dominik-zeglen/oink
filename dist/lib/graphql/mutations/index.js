const containerMutation = require('./container');
const moduleMutation = require('./module');
const objectMutation = require('./object');

module.exports = ((db, userId) => {
  return {
    ...containerMutation(db, userId),
    ...moduleMutation(db, userId),
    ...objectMutation(db, userId),
  };
});
