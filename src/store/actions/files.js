import { LOAD_FILES_LIST, SET_FILES_LIST, ADD_FILE } from '../actionTypes';
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
    dispatch({
      type: ADD_FILE,
      file
    });
  });
}

export { initFilesList, addFile };
