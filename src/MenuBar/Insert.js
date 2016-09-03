import React, { Component } from 'react';
import snippetsEventEmitter from '../SnippetEvents';

class Insert extends Component {
  constructor() {
    super();

    this.state = {
      showSubmenu: false
    };

    ["toggleSubmenu", "onAddAddition"].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });
  }

  render() {
    return (
      <li className={ this.state.showSubmenu ? 'active' : '' }>
        <span onClick={ this.toggleSubmenu }>
          Insert
        </span>

        <div className="submenu-container">
          <ul className="submenu">
            <li onClick={ this.onAddAddition }>
              Addition
            </li>
          </ul>
        </div>
      </li>
    );
  }

  toggleSubmenu() {
    this.setState({
      showSubmenu: !this.state.showSubmenu
    });
  }

  onAddAddition() {
    this.setState({
      showSubmenu: false
    });

    snippetsEventEmitter.emitSnippet(">[-<+>]<");
  }
}

export default Insert;
