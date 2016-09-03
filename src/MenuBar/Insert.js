import React, { Component } from 'react';
import snippetsEventEmitter from '../SnippetEvents';

class Insert extends Component {
  constructor() {
    super();

    this.state = {
      showSubmenu: false
    };

    ["toggleSubmenu", "onAddAddition", "onAddFindSign", "onAddMultiplication", "onAddPrintValue"].forEach(fn => {
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
            <li onClick={ this.onAddMultiplication }>
              Multiplication
            </li>
            <li onClick={ this.onAddPrintValue }>
              Print Cell
            </li>
            <li onClick={ this.onAddFindSign }>
              Find Sign
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

    snippetsEventEmitter.emitSnippet("Addition a + b; a: current cell; b: cell right of a");
    snippetsEventEmitter.emitSnippet(">[-<+>]<");
  }

  onAddMultiplication() {
    this.setState({
      showSubmenu: false
    });

    snippetsEventEmitter.emitSnippet("Addition a + b; a: current cell; b: cell right of a");
    snippetsEventEmitter.emitSnippet("[<+>-]<[>>[-<+>>+<]>[<+>-]<<<-]>>[-]<");
  }

  onAddFindSign() {
    this.setState({
      showSubmenu: false
    });

    snippetsEventEmitter.emitSnippet("Returns 1 if the current cell is positive. 0 otherwise. Value in current cell will be lost");
    snippetsEventEmitter.emitSnippet(">>+>+<<<[>+>[<[-<+<+>>]>->-]>[<<[-<-<+>>]>+>->]<<<<<[->>+<<]>>>>+<<<]>[-]>>[-]<[-<<+>]<>++++++++[<++++++>-]<.");
  }

  onAddPrintValue() {
    this.setState({
      showSubmenu: false
    });

    snippetsEventEmitter.emitSnippet("Prints the current value of cell");
    snippetsEventEmitter.emitSnippet("[>>+>+<<<-]>>>[<<<+>>>-]<<+>[<->[>++++++++++<[->-[>+>>]>[+[-<+>]>+>>]<<<<<]>[-]++++++++[<++++++>-]>[<<+>>-]>[<<+>>-]<<]>]<[->>++++++++[<++++++>-]]<[.[-]<]<");
  }
}

export default Insert;
