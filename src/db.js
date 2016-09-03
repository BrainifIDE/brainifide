import Dexie from 'dexie';

const db = new Dexie('bf');

db.version(1).stores({
  codes: '++id,content,name,createdAt,updatedAt'
});

const promise = db.open().then(() => db);

export default promise;
