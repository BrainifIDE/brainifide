import React, { Component } from 'react';
import snippetsEventEmitter from '../SnippetEvents';

class Insert extends Component {
  constructor() {
    super();

    this.state = {
      showSubmenu: false
    };

    ["toggleSubmenu", "onAddAddition", "onAddFindSign", "onAddMultiplication", "onAddModulo", "onAddPrintValue"].forEach(fn => {
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
            <li onClick={ this.onAddModulo }>
              Modulo
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

    snippetsEventEmitter.emitSnippet(">[-<+>]<", "Addition a + b; a: current cell; b: cell right of a");
  }

  onAddMultiplication() {
    this.setState({
      showSubmenu: false
    });

    snippetsEventEmitter.emitSnippet("[<+>-]<[>>[-<+>>+<]>[<+>-]<<<-]>>[-]<", "Multiplication a + b; a: current cell; b: cell right of a");
  }

  onAddFindSign() {
    this.setState({
      showSubmenu: false
    });

    snippetsEventEmitter.emitSnippet(">>+>+<<<[>+>[<[-<+<+>>]>->-]>[<<[-<-<+>>]>+>->]<<<<<[->>+<<]>>>>+<<<]>[-]>>[-]<[-<<+>]<>++++++++[<++++++>-]<.", "Returns 1 if the current cell is positive. 0 otherwise. Value in current cell will be lost");
  }

  onAddPrintValue() {
    this.setState({
      showSubmenu: false
    });

    snippetsEventEmitter.emitSnippet("[>>+>+<<<-]>>>[<<<+>>>-]<<+>[<->[>++++++++++<[->-[>+>>]>[+[-<+>]>+>>]<<<<<]>[-]++++++++[<++++++>-]>[<<+>>-]>[<<+>>-]<<]>]<[->>++++++++[<++++++>-]]<[.[-]<]<", "Prints the current value of cell");
  }

  onAddModulo() {
    this.setState({
      showSubmenu: false
    });

    snippetsEventEmitter.emitSnippet("Modulo n % d; n: current cell, d: cell right of n");
    snippetsEventEmitter.emitSnippet("[>->+<[>]>[<+>-]<<[<]>-]>[-]>[-<<+>>]<++++++++[<++++++>-]<.");
  }
}

export default Insert;
