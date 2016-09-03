import { LOAD_FILES_LIST, SET_FILES_LIST } from '../actionTypes';
import Dexie from 'dexie';

function loadFilesList() {
  return {
    type: LOAD_FILES_LIST
  };
}

function setFilesList(files) {
  return {
    type: SET_FILES_LIST,
    files
  };
}

function initFilesList(dispatch) {
  dispatch(loadFilesList());

  const db = new Dexie('bf');

  db.version(1).stores({
    codes: 'content,&name,created_at,updated_at'
  });

  db.open().then(() => {
    return db.codes.toArray();
  }).then(codes => {
    dispatch(setFilesList(codes));
  }).catch(() => {
    console.error("something's wrong");
  });
}

export { initFilesList };
