import React, { Component } from 'react';
import store from './store/store';
import { initFilesList, deleteFile } from './store/actions/files';
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
            className={ id === this.state.selectedFile ? 'file active' : 'file' }
            onClick={ this.onSelectFile.bind(this, id) }>
          <span className="name">{ name }</span>
          <span className="trash"
                onClick={ this.onDeleteFile.bind(this, id) }>
            <i className="fa fa-trash-o" />
          </span>
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

  onDeleteFile(id, event) {
    event.stopPropagation();
    const file = this.state.files.find(file => file.id === id);

    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      deleteFile(store.dispatch.bind(store), id);
    }
  }
}

export default FilesList;
