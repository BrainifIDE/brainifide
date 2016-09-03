import React, { Component } from 'react';
import './DataStoreVisualizer.css';

class DataStoreVisualizer extends Component {
  renderCells() {
    const numbers = [];
    const context = this.props.executionContext;

    for (let i = -7; i <= 7; i++) {
      numbers.push(context.table[context.pointer + i] || 0);
    }

    const output = numbers.map((num, i) => {
      return (
        <div key={context.pointer + i - 7} className="cell" style={{left: ((i-2) * 50) + "px"}}>
          <div>{ num }</div>
          <div>{ context.pointer + i - 7}</div>
        </div>
      );
    });

    output.push(<div key="highlight" className="cell highlight" />);

    return output;
  }

  render() {
    return (
      <div className="DataStoreVisualizer">
        { this.renderCells() }
      </div>
    );
  }
}

export default DataStoreVisualizer;
