import React from 'react';
import Calendar from './Calendar';
import './App.scss';

const App = () => {
  return (
    <div className="App">
      <Calendar date={new Date()} />
    </div>
  );
};

export default App;
