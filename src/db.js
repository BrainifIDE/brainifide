import Dexie from 'dexie';

const db = new Dexie('bf');

db.version(1).stores({
  codes: 'content,&name,created_at,updated_at'
});

const promise = db.open().then(() => db);

export default promise;
