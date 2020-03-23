import React from 'react';
import Location from './Location';
import DateControls from './DateControls';
import './Header.scss';

export default React.memo(function Header() {
  return (
    <div className="Header">
      <Location />
      <DateControls />
    </div>
  );
});
