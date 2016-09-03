import { LOAD_FILES_LIST, SET_FILES_LIST } from '../actionTypes';

function files(state = [], action) {
  switch (action.type) {
    case SET_FILES_LIST:
      return action.files;
    case LOAD_FILES_LIST:
    default:
      return state;
  }
}

export default files;
