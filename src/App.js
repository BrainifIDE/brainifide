import React, { Component } from 'react';
import './App.css';
import { parser, execute, executeStep } from 'bfvm';
import DataStoreVisualizer from './DataStoreVisualizer';

class App extends Component {
  constructor() {
    super();

    this.stepper = () => {};
    this.intervalID;

    this.state = {
      code: "",
      stdout: "",
      input: "",
      timerSpeed: 1000,
      executionContext: {
        table: {},
        position: 0
      }
    };

    ["onInputChange", "onCodeChange", "onRunCode", "onStepCode", "onTimerSpeedChange", "onAutoStepCode", "onStopAutoStepCode"].forEach(fn => {
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

        <div className="visualizer">
          <DataStoreVisualizer executionContext={ this.state.executionContext } />
        </div>

        <div className="buttons">
          <button onClick={ this.onRunCode }>Run</button>
        </div>

        <div className="buttons">
          <button onClick={ this.onStepCode }>Stepthrough</button>
        </div>

        <div className="code-container">
          <textarea value={ this.state.timerspeed }
                    onChange={ this.onTimerSpeedChange } />
        </div>

        <div className="buttons">
          <button onClick={ this.onAutoStepCode }>Auto Stepthrough</button>
        </div>

        <div className="buttons">
          <button onClick={ this.onStopAutoStepCode }>Stop Auto Stepthrough</button>
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

    const ast = parser(this.state.code);
    this.stepper = executeStep(ast, event.target.value);
  }

  onCodeChange(event) {
    this.setState({
      code: event.target.value
    });

    const ast = parser(event.target.value);
    this.stepper = executeStep(ast, this.state.input);
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

  onStepCode(event) {
    this.stepper((context, stdout, instruction) => {
      console.log(instruction);
      this.setState({
        stdout: stdout,
        executionContext: context
      })
    });
  }

  onAutoStepCode(event) {
    this.intervalID = setInterval(this.onStepCode, this.state.timerSpeed);
  }

  onStopAutoStepCode(event) {
    clearInterval(this.intervalID);
  }

  onTimerSpeedChange(event) {
    if (/^\d*$/.test(event.target.value)) {
      this.setState({
        timerSpeed: event.target.value
      });      
    }
  }
}

export default App;
