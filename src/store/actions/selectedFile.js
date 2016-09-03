import { SELECT_FILE } from '../actionTypes';

function selectFile(id) {
  return {
    type: SELECT_FILE,
    id
  };
}

export { selectFile };
