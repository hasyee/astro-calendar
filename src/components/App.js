import React from 'react';
import Header from './Header';
import Calendar from './Calendar';
import { useLocalStorage, useWorker } from '../hooks';
import './App.scss';

export default React.memo(function App() {
  useLocalStorage();
  useWorker();

  return (
    <div className="App">
      <Header />
      <Calendar />
    </div>
  );
});
