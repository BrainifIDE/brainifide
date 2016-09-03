import { LOAD_FILES_LIST, SET_FILES_LIST } from '../actionTypes';
import dbPromise from '../../db';

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

  dbPromise.then(db => {
    return db.codes.toArray();
  }).then(codes => {
    dispatch(setFilesList(codes));
  }).catch(() => {
    console.error("something's wrong");
  });
}

function addFile(dispatch, file) {
  dbPromise.then(db => {
    if (file.id !== -1) {
      return db.codes.put({
        id: file.id,
        content: file.content,
        name: file.name,
        createdAt: file.createdAt,
        updatedAt: new Date().valueOf()
      });
    } else {
      return db.codes.add({
        content: file.content,
        name: file.name,
        createdAt: new Date().valueOf(),
        updatedAt: new Date().valueOf()
      });
    }
  }).then(() => {
    initFilesList(dispatch);
  });
}

export { initFilesList, addFile };
