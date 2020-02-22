import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button, NumericInput, FormGroup } from '@blueprintjs/core';
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
      <FormGroup label="Longitude" inline>
        <NumericInput value={lng} onValueChange={setLng} min={-180} max={+180} />
      </FormGroup>
      <FormGroup label="Latitude" inline>
        <NumericInput value={lat} onValueChange={setLat} min={-90} max={+90} />
      </FormGroup>
      <Button onClick={handleSubmit} small>
        submit
      </Button>
    </div>
  );
};

export default Location;
