import React, { Component } from 'react';
import { parser, execute, executeStep } from 'bfvm';
import DataStoreVisualizer from './DataStoreVisualizer';
import './IDE.css';
import { addFile } from './store/actions/files';
import store from './store/store';
import { selectFile } from './store/actions/selectedFile';
import snippetsEventEmitter from './SnippetEvents';

class IDE extends Component {
  constructor() {
    super();

    this.state = {
      id: -1,
      code: "",
      stdout: "",
      input: "",
      timerSpeed: 1000,
      name: "",
      dirty: false,
      executionContext: {
        table: {},
        pointer: 0
      }
    };

    ["onInputChange", "onCodeChange", "onRunCode", "onStepCode", "onTimerSpeedChange", "onAutoStepCode", "onStopAutoStepCode", "onNameChange", "onSave", "onAddSnippet"].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });
  }

  componentDidMount() {
    store.subscribe(() => {
      const state = store.getState();
      const id = state.selectedFile;
      const file = state.files.find(file => file.id === id);

      if (!file) {
        return;
      }

      if (id === this.state.id) {
        return;
      }

      if (!this.state.dirty || confirm("You have unsaved work. Are you sure?")) {
        this.setState({
          code: file.content,
          stdout: "",
          input: "",
          name: file.name,
          id: file.id
        });
      } else {
        store.dispatch(selectFile(this.state.id));
      }
    });

    snippetsEventEmitter.addSnippetsListener(this.onAddSnippet);
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
                    onChange={ this.onCodeChange }
                    ref={ c => this.code = c }/>
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
      code: event.target.value,
      dirty: true
    });

    const ast = parser(event.target.value);
    this.stepper = executeStep(ast, this.state.input);
    clearInterval(this.intervalID);
  }

  onInputChange(event) {
    this.setState({
      input: event.target.value
    });

    const ast = parser(this.state.code);
    this.stepper = executeStep(ast, event.target.value);
    clearInterval(this.intervalID);
  }

  onRunCode() {
    const ast = parser(this.state.code);
    const executionResults = execute(ast, this.state.input);

    this.setState({
      stdout: executionResults.stdout,
      executionContext: executionResults.context
    });

    clearInterval(this.intervalID);
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
    // Deal with optimistic update
    this.setState({
      dirty: false
    });
    addFile(store.dispatch.bind(store), {
      id: this.state.id,
      content: this.state.code,
      name: this.state.name
    });
  }

  onAddSnippet(snippet) {
    const index = this.code.selectionStart;
    let code = this.state.code.substr(0, index);

    if (code.length && code[code.length - 1] !== '\n') {
      code += "\n";
    }

    code = code + snippet + "\n" + this.state.code.substr(index);

    this.setState({
      code
    });
  }
}

export default IDE;
