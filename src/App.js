import React, { Component } from 'react';
import './App.css';
import FilesList from './FilesList';
import IDE from './IDE';
import MenuBar from './MenuBar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="menu">
          <MenuBar />
        </div>

        <div className="content">
          <div className="left">
            <FilesList />
          </div>

          <div className="right">
            <IDE />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
