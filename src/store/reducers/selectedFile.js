import { SELECT_FILE } from '../actionTypes';

function selectedFile(state = -1, action) {
  switch (action.type) {
    case SELECT_FILE:
      return action.id;
    default:
      return state;
  }
}

export default selectedFile;
