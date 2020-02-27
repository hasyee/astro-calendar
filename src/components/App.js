import React from 'react';
import Header from './Header';
import Calendar from './Calendar';
import { useLocalStorage } from '../hooks';
import './App.scss';

export default React.memo(function App() {
  useLocalStorage();

  return (
    <div className="App">
      <Header />
      <Calendar />
    </div>
  );
});
