import React, { useState } from 'react';
import { Button, NumericInput, FormGroup } from '@blueprintjs/core';
import { useLocation } from '../store';
import './Location.scss';

export default React.memo(() => {
  const [location, setLocation] = useLocation();
  const [lng, setLng] = useState(location[0]);
  const [lat, setLat] = useState(location[1]);

  return (
    <div className="Location">
      <FormGroup label="Longitude" inline className="form-group">
        <NumericInput value={lng} onValueChange={setLng} min={-180} max={+180} />
      </FormGroup>
      <FormGroup label="Latitude" inline className="form-group">
        <NumericInput value={lat} onValueChange={setLat} min={-90} max={+90} />
      </FormGroup>
      <Button onClick={() => setLocation([lng, lat])}>SUBMIT</Button>
    </div>
  );
});
