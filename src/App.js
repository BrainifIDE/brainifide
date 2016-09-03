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
        <div className="code-container">
          <textarea value={ this.state.code }
                    onChange={ this.onCodeChange } />
        </div>

        <div className="buttons">
          <button onClick={ this.onRunCode } >Run</button>
        </div>

        <div className="stdout">
          { this.state.stdout }
        </div>
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
