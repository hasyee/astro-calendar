import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button, NumericInput } from '@blueprintjs/core';
import { getLocation, useActions } from '../store';
import './Location.scss';

const Location = () => {
  const location = useSelector(getLocation);
  const { setLocation } = useActions();
  const [lng, setLng] = useState(location[0]);
  const [lat, setLat] = useState(location[1]);

  const handleSubmit = useCallback(() => setLocation([lng, lat]), [lng, lat]);

  return (
    <div className="Location">
      <NumericInput value={lng} onValueChange={setLng} />
      <NumericInput value={lat} onValueChange={setLat} />
      <Button onClick={handleSubmit}>submit</Button>
    </div>
  );
};

export default Location;
