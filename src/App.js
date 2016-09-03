import React, { Component } from 'react';
import './App.css';
import { parser, execute } from 'bfvm';

class App extends Component {
  constructor() {
    super();

    this.state = {
      code: "",
      stdout: "",
      input: ""
    };

    ["onInputChange", "onCodeChange", "onRunCode"].forEach(fn => {
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

        <h3>Inputs:</h3>
        <div className="code-container">
          <textarea value={ this.state.input }
                    onChange={ this.onInputChange } />
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

  onInputChange(event) {
    this.setState({
      input: event.target.value
    });
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
      stdout: execute(ast, this.state.input)
    });
  }
}

export default App;
