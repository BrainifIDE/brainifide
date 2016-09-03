import React, { Component } from 'react';
import { parser, execute, executeStep, executeSingleInstruction, ExecutionContext } from 'bfvm';
import DataStoreVisualizer from './DataStoreVisualizer';
import './IDE.css';
import { addFile } from './store/actions/files';
import store from './store/store';
import { selectFile } from './store/actions/selectedFile';
import snippetsEventEmitter from './SnippetEvents';
import Immutable from 'immutable';

function makeMockContext() {
  return {
    table: {
      get() {
        return 0;
      }
    },
    pointer: 0
  };
}

class IDE extends Component {
  constructor() {
    super();

    this.state = {
      id: -1,
      code: "",
      stdout: "",
      input: "",
      timerSpeed: 500,
      name: "Untitled",
      dirty: false,
      contextStack: Immutable.Stack.of(makeMockContext()),
      instructionsStack: new Immutable.Stack(),
      stdoutStack: Immutable.Stack.of(''),
      stdinStack: Immutable.Stack.of(Immutable.Stack(['']))
    };

    this.stopAutoStep = true;

    ["onInputChange", "onCodeChange", "onRunCode", "onStepCode", "onTimerSpeedChange", "onAutoStepCode", "onStopAutoStepCode", "onNameChange", "onSave", "onAddSnippet", "onPreviousStep"].forEach(fn => {
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
        this.stepper = executeStep(parser(file.content), this.state.input);
      } else {
        store.dispatch(selectFile(this.state.id));
      }
    });

    snippetsEventEmitter.addSnippetsListener(this.onAddSnippet);
  }

  render() {
    const instruction = this.state.instructionsStack.first();
    const line = instruction && instruction.line;
    const column = instruction && instruction.column;

    return (
      <div className="IDE">
        <div className="name-container">
          <input type="text"
                 className="name-field"
                 value={ this.state.name }
                 onChange={ this.onNameChange } />
         <button className="save" onClick={ this.onSave }>
           <i className="fa fa-save fa-2x" />
         </button>
        </div>

        <div className="code-container">
          <textarea value={ this.state.code }
                    onChange={ this.onCodeChange }
                    ref={ c => this.code = c }/>
          <div style={{
            display: column !== undefined ? 'block' : 'none',
            top: (20 * (line + 1) + 0) + "px",
            left: (9 * column + 3) + "px"
          }} className="cursor"/>
        </div>

        <h3>Inputs:</h3>
        <div className="input-container">
          <textarea value={ this.state.input }
                    onChange={ this.onInputChange } />
        </div>

        <div className="visualizer">
          <DataStoreVisualizer executionContext={ this.state.contextStack.first() } />
        </div>

        <div className="buttons">
          <button onClick={ this.onRunCode }>Run</button>
          <button onClick={ this.onPreviousStep }>Previous Step</button>
          <button onClick={ this.onStepCode }>Stepthrough</button>
          <input type="range"
                 min="100"
                 max="1000"
                 value={ this.state.timerSpeed }
                 onChange={ this.onTimerSpeedChange } />
          <button onClick={ this.onAutoStepCode }>Auto Stepthrough</button>
          <button onClick={ this.onStopAutoStepCode }>Stop Auto Stepthrough</button>
        </div>

        <div className="stdout">
          { this.state.stdoutStack.first() }
        </div>
      </div>
    );
  }

  onCodeChange(event) {
    this.setState({
      code: event.target.value,
      dirty: true,
      contextStack: Immutable.Stack.of(makeMockContext()),
      instructionsStack: new Immutable.Stack(),
      stdoutStack: Immutable.Stack.of(''),
      stdinStack: Immutable.Stack.of(Immutable.Stack(['']))
    });

    const ast = parser(event.target.value);
    this.stepper = executeStep(ast, this.state.input);
    this.stopAutoStep = true;
  }

  onInputChange(event) {
    this.setState({
      input: event.target.value,
      contextStack: Immutable.Stack.of(makeMockContext()),
      instructionsStack: new Immutable.Stack(),
      stdoutStack: Immutable.Stack.of(''),
      stdinStack: Immutable.Stack.of(Immutable.Stack(event.target.value.split('')))
    });

    const ast = parser(this.state.code);
    this.stepper = executeStep(ast, event.target.value);
    this.stopAutoStep = true;
  }

  onRunCode() {
    const ast = parser(this.state.code);
    const executionResults = execute(ast, this.state.input);

    this.setState({
      stdoutStack: Immutable.Stack.of(executionResults.stdout),
      stdinStack: Immutable.Stack.of(new Immutable.Stack([''])),
      contextStack: Immutable.Stack.of(executionResults.context),
    });
  }

  onStepCode() {
    let instruction;
    let context;
    let stdout;
    let stdin;

    if (this.state.instructionsStack.isEmpty()) {
      instruction = parser(this.state.code)[0];
      context = new ExecutionContext();
      stdout = '';
      stdin = Immutable.Stack(this.state.input.split(''));
    } else {
      instruction = this.state.instructionsStack.first();
      context = this.state.contextStack.first();
      stdout = this.state.stdoutStack.first();
      stdin = this.state.stdinStack.first();
    }

    if (!instruction) {
      return;
    }

    const results = executeSingleInstruction(context, instruction, stdin);

    this.setState({
      stdout: results.stdout,
      contextStack: this.state.contextStack.push(results.context),
      instructionsStack: this.state.instructionsStack.push(results.instruction),
      stdoutStack: this.state.stdoutStack.push(stdout + results.stdout),
      stdinStack: this.state.stdinStack.push(results.stdin)
    });

    if (!this.stopAutoStep && results.instruction) {
      setTimeout(this.onStepCode, 1100 - this.state.timerSpeed);
    }
  }

  onAutoStepCode() {
    this.stopAutoStep = false;
    setTimeout(this.onStepCode, 1100 - this.state.timerSpeed);
  }

  onStopAutoStepCode() {
    this.stopAutoStep = true;
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

  onAddSnippet(snippet, comment) {
    const index = this.code.selectionStart;
    let code = this.state.code.substr(0, index);

    if (code.length && code[code.length - 1] !== '\n') {
      code += "\n";
    }

    if (comment) {
      code += "================================================================================\n";
      code = code + comment + "\n";
      code += "================================================================================\n";
    }

    code = code + snippet + "\n" + this.state.code.substr(index);

    this.setState({
      code
    });
  }

  onPreviousStep() {
    this.setState({
      contextStack: this.state.contextStack.pop(),
      instructionsStack: this.state.instructionsStack.pop(),
      stdoutStack: this.state.stdoutStack.pop(),
      stdinStack: this.state.stdinStack.pop()
    });
  }
}

export default IDE;
