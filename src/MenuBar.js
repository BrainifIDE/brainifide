import React, { Component } from 'react';
import './MenuBar.css';
import Insert from './MenuBar/Insert';

class MenuBar extends Component {
  render() {
    return (
      <div className="MenuBar">
        <ul>
          <Insert />
        </ul>
      </div>
    );
  }
}

export default MenuBar;
