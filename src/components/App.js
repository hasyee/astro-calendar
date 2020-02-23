import React from 'react';
import Header from './Header';
import Calendar from './Calendar';
import './App.scss';

export default React.memo(function App() {
  return (
    <div className="App">
      <Header />
      <Calendar />
    </div>
  );
});
