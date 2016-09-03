import React, { Component } from 'react';
import './App.css';
import { parser, execute } from 'bfvm';
import DataStoreVisualizer from './DataStoreVisualizer';
import FilesList from './FilesList';

class App extends Component {
  constructor() {
    super();

    this.state = {
      code: "",
      stdout: "",
      input: "",
      executionContext: {
        table: {},
        position: 0
      }
    };

    ["onInputChange", "onCodeChange", "onRunCode"].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });
  }

  render() {
    return (
      <div className="App">
        <div className="left">
          <FilesList />
        </div>

        <div className="right">
          <div className="code-container">
            <textarea value={ this.state.code }
                      onChange={ this.onCodeChange } />
          </div>

          <h3>Inputs:</h3>
          <div className="code-container">
            <textarea value={ this.state.input }
                      onChange={ this.onInputChange } />
          </div>

          <div className="visualizer">
            <DataStoreVisualizer executionContext={ this.state.executionContext } />
          </div>

          <div className="buttons">
            <button onClick={ this.onRunCode }>Run</button>
          </div>

          <div className="stdout">
            { this.state.stdout }
          </div>
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
    const executionResults = execute(ast, this.state.input);
    this.setState({
      stdout: executionResults.stdout,
      executionContext: executionResults.context
    });
  }
}

export default App;
