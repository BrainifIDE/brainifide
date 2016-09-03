import React, { Component } from 'react';
import store from './store/store';
import { initFilesList } from './store/actions/files';
import './FilesList.css';

class FilesList extends Component {
  constructor() {
    super();

    this.state = {
      files: []
    };
  }

  componentDidMount() {
    initFilesList(store.dispatch.bind(store));

    this.unsubscribe = store.subscribe(() => {
      this.setState({
        files: store.getState().files
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderFiles() {
    return this.state.files.map(({id, name}) => {
      return <li key={id}>{name}</li>;
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
}

export default FilesList;
