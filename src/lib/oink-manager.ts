import * as minimist from 'minimist';
import * as monk from 'monk';
import createDefaultSchema from './default-schema';

const envValues = minimist(process.argv.slice(2));
const collections = [
  'modules',
  'fields',
  'objects',
  'containers',
];

(() => {
  const defaultSchema = createDefaultSchema();
  if (Object.keys(envValues).length > 1 || envValues._.length > 0) {
    if (envValues._.indexOf('create-db') >= 0) {
      if (Object.keys(envValues).indexOf('db') !== -1) {
        const db = monk.default(envValues.db);
        collections.forEach((c) => {
          db.get(c).insert(defaultSchema[c]).then(() => {
            console.log(c + ' inserted!');
          }).catch(() => {
            console.log(c + ' could not be inserted');
          });
          console.log(c);
        });
      } else {
        throw new Error('Missing database path');
      }
    } else {
      if (envValues._.indexOf('drop-db') >= 0) {
        if (Object.keys(envValues).indexOf('db') !== -1) {
          const db = monk.default(envValues.db);
          collections.forEach((c) => {
            db.get(c).drop().then(() => {
              console.log(c + ' dropped!');
            }).catch(() => {
              console.log(c + ' could not be dropped');
            });
            console.log(c);
          });

        } else {
          throw new Error('Missing database path');
        }
      } else {
        throw new Error('Missing valid arguments');
      }
    }

  } else {
    throw new Error('Missing valid arguments');
  }

  return true;
})();