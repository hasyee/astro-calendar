import React, { useState, useCallback } from 'react';
import { Button, NumericInput, FormGroup } from '@blueprintjs/core';
import { useSelector, useActions, getLocation } from '../store';
import './Location.scss';

export default React.memo(function Location() {
  const location = useSelector(getLocation);
  const { setLocation } = useActions();
  const [lng, setLng] = useState(location[0]);
  const [lat, setLat] = useState(location[1]);
  const handleSubmit = useCallback(() => setLocation([lng, lat]), [setLocation, lng, lat]);

  return (
    <div className="Location">
      <FormGroup label="Lat" inline className="form-group">
        <NumericInput value={lat} onValueChange={setLat} min={-90} max={+90} className="input" />
      </FormGroup>
      <FormGroup label="Lng" inline className="form-group">
        <NumericInput value={lng} onValueChange={setLng} min={-180} max={+180} className="input" />
      </FormGroup>
      <Button onClick={handleSubmit}>OK</Button>
    </div>
  );
});
