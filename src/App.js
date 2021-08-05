import React from 'react';
import Timer from './components/Timer';
import './App.css';

class App extends React.Component {
  render() {
    return(
      <section className="app">
        <Timer />
      </section>
    );
  }
}

export default App;
