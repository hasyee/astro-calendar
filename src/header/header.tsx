import React from 'react';
import Location from '../location/location';
import DateControls from '../date/date.controls';
import './header.scss';

export default React.memo(function Header() {
  return (
    <div className="Header">
      <div className="left-side">
        <Location />
      </div>

      <DateControls />
    </div>
  );
});
