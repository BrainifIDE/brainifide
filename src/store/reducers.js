import { combineReducers } from 'redux';
import files from './reducers/files';
import selectedFile from './reducers/selectedFile';

const reducers = combineReducers({
  files,
  selectedFile
});

export default reducers;
