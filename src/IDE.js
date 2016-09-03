import React, { Component } from 'react';
import { parser, execute, executeStep } from 'bfvm';
import DataStoreVisualizer from './DataStoreVisualizer';
import './IDE.css';
import { addFile } from './store/actions/files';
import store from './store/store';

class IDE extends Component {
  constructor() {
    super();

    this.state = {
      code: "",
      stdout: "",
      input: "",
      timerSpeed: 1000,
      name: "",
      executionContext: {
        table: {},
        position: 0
      }
    };

    ["onInputChange", "onCodeChange", "onRunCode", "onStepCode", "onTimerSpeedChange", "onAutoStepCode", "onStopAutoStepCode", "onNameChange", "onSave"].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });
  }

  render() {
    return (
      <div className="IDE">
        <div className="name-container">
          <input type="text"
                 value={ this.state.name }
                 onChange={ this.onNameChange } />
          <button onClick={ this.onSave }>Save</button>
        </div>

        <div className="code-container">
          <textarea value={ this.state.code }
                    onChange={ this.onCodeChange } />
        </div>

        <h3>Inputs:</h3>
        <div className="input-container">
          <textarea value={ this.state.input }
                    onChange={ this.onInputChange } />
        </div>

        <div className="visualizer">
          <DataStoreVisualizer executionContext={ this.state.executionContext } />
        </div>

        <div className="buttons">
          <button onClick={ this.onRunCode }>Run</button>
          <button onClick={ this.onStepCode }>Stepthrough</button>
          <input value={ this.state.timerSpeed }
                 onChange={ this.onTimerSpeedChange } />
          <button onClick={ this.onAutoStepCode }>Auto Stepthrough</button>
          <button onClick={ this.onStopAutoStepCode }>Stop Auto Stepthrough</button>
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

    const ast = parser(event.target.value);
    this.stepper = executeStep(ast, this.state.input);
  }

  onInputChange(event) {
    this.setState({
      input: event.target.value
    });

    const ast = parser(this.state.code);
    this.stepper = executeStep(ast, event.target.value);
  }

  onRunCode() {
    const ast = parser(this.state.code);
    const executionResults = execute(ast, this.state.input);

    this.setState({
      stdout: executionResults.stdout,
      executionContext: executionResults.context
    });
  }

  onStepCode() {
    this.stepper((context, stdout) => {
      this.setState({
        stdout,
        executionContext: context
      });
    });
  }

  onAutoStepCode() {
    this.intervalID = setInterval(this.onStepCode, this.state.timerSpeed);
  }

  onStopAutoStepCode() {
    clearInterval(this.intervalID);
  }

  onTimerSpeedChange(event) {
    if (/^\d*$/.test(event.target.value)) {
      this.setState({
        timerSpeed: event.target.value
      });
    }
  }

  onNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  onSave() {
    addFile(store.dispatch.bind(store), {
      content: this.state.code,
      name: this.state.name
    });
  }
}

export default IDE;
