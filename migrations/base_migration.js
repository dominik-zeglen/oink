const monk = require('monk');

const dbPath = process.env.MONGODB_PATH || 'mongodb://127.0.0.1:27017/oink';
const db = monk(dbPath);

// Migration code goes here
// Don't forget to call db.close()
