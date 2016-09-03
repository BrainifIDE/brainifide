import React, { Component } from 'react';
import './DataStoreVisualizer.css';

class DataStoreVisualizer extends Component {
  renderCells() {
    const numbers = [];
    const context = this.props.executionContext;

    for (let i = -5; i <= 5; i++) {
      numbers.push(context.table[context.pointer + i] || 0);
    }

    return numbers.map((num, i) => {
      return <div key={i} className="cell">{ num }</div>;
    });
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
