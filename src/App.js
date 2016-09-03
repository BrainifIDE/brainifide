import React, { Component } from 'react';
import './App.css';
import FilesList from './FilesList';
import IDE from './IDE';

class App extends Component {
  render() {
    return (
      <div className="App">
        <FilesList />
        <IDE />
      </div>
    );
  }
}

export default App;
