import React, { Component } from 'react';
import store from './store/store';
import { initFilesList } from './store/actions/files';
import './FilesList.css';
import { selectFile } from './store/actions/selectedFile';

class FilesList extends Component {
  constructor() {
    super();

    this.state = {
      selectedFile: -1,
      files: []
    };
  }

  componentDidMount() {
    initFilesList(store.dispatch.bind(store));

    this.unsubscribe = store.subscribe(() => {
      this.setState({
        files: store.getState().files,
        selectedFile: store.getState().selectedFile
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderFiles() {
    return this.state.files.map(({id, name}) => {
      return (
        <li key={id}
            className={ id === this.state.selectedFile ? 'active' : '' }
            onClick={ this.onSelectFile.bind(this, id) }>
          { name }
        </li>
      );
    });
  }

  render() {
    return (
      <div className="FilesList">
        <ul>
          { this.renderFiles() }
        </ul>
      </div>
    );
  }

  onSelectFile(id, event) {
    store.dispatch(selectFile(id));
  }
}

export default FilesList;
