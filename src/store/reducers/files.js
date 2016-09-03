import { LOAD_FILES_LIST, SET_FILES_LIST, ADD_FILE, DELETE_FILE } from '../actionTypes';

function files(state = [], action) {
  switch (action.type) {
    case SET_FILES_LIST:
      return action.files;
    case ADD_FILE:
      return [
        ...state,
        action.file
      ];
    case DELETE_FILE:
      return state.filter(({id}) => id !== action.id);
    case LOAD_FILES_LIST:
    default:
      return state;
  }
}

export default files;
