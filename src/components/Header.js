import React from 'react';
import { Button } from '@blueprintjs/core';
import Location from './Location';
import Weather from './Weather';
import DateControls from './DateControls';
import './Header.scss';

export default React.memo(function Header() {
  return (
    <div className="Header">
      <div className="left-side">
        <Location />
        {/* <Weather /> */}
      </div>

      <DateControls />
    </div>
  );
});
