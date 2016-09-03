import { SELECT_FILE, DELETE_FILE } from '../actionTypes';

function selectedFile(state = -1, action) {
  switch (action.type) {
    case SELECT_FILE:
      return action.id;
    case DELETE_FILE:
      return action.id === state ? -1 : state;
    default:
      return state;
  }
}

export default selectedFile;
