import React, { Component } from 'react';
import './App.css';
import { parser, execute } from 'bfvm';

class App extends Component {
  constructor() {
    super();

    this.state = {
      code: "",
      stdout: ""
    };

    ["onCodeChange", "onRunCode"].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });
  }

  render() {
    return (
      <div className="App">
        <textarea value={ this.state.code }
                  onChange={ this.onCodeChange } />

        <button onClick={ this.onRunCode } >Run</button>
        <div>{ this.state.stdout }</div>
      </div>
    );
  }

  onCodeChange(event) {
    this.setState({
      code: event.target.value
    });
  }

  onRunCode(event) {
    event.preventDefault();

    const ast = parser(this.state.code);
    this.setState({
      stdout: execute(ast)
    });
  }
}

export default App;
