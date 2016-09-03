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
      if (i == 5) {
        return <div key={i} className="cell">
               <tr>{ num }</tr>
               <tr>{ context.pointer + i - 5 }</tr>
               <tr>^</tr>
               </div>;
      }
      return <div key={i} className="cell">
              <tr>{ num }</tr>
              <tr>{ context.pointer + i - 5 }</tr>
             </div>;
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
