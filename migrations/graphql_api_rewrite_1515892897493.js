const monk = require('monk');

const dbPath = process.env.MONGODB_PATH || 'mongodb://127.0.0.1:27017/oink';
const db = monk(dbPath);

const collections = ['containers', 'modules', 'objects'];

async function updateCollection(collection) {
  await db.get(collection).find()
    .then(containers => db.get(collection)
      .remove({})
      .then(() => db.get(collection)
        .insert(containers.map((container) => {
          const c = container;
          c.parentId = c.parent_id;
          c.createdAt = c.created_at;
          delete c.parent_id;
          delete c.created_at;
          return c;
        }))
        .then(() => console.log(`Collection ${collection} updated`)))
      .catch(e => console.log(e)))
    .catch(e => console.log(e));
}

Promise.all(collections.map(updateCollection)).then(db.close);
