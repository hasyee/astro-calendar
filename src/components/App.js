import React from 'react';
import Calendar from './Calendar';
import './App.scss';

export default React.memo(function App() {
  return (
    <div className="App">
      <Calendar date={new Date()} />
    </div>
  );
});
