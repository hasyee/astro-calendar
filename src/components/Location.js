import React, { useState, useCallback } from 'react';
import { Button, NumericInput, FormGroup, Dialog, Classes } from '@blueprintjs/core';
import { useSelector, useActions, getLocation } from '../store';
import './Location.scss';

export default React.memo(function Location({ isOpen, onClose }) {
  const location = useSelector(getLocation);
  const { setLocation } = useActions();
  const [lng, setLng] = useState(location[0]);
  const [lat, setLat] = useState(location[1]);
  const handleSubmit = useCallback(() => {
    setLocation([lng, lat]);
    onClose();
  }, [setLocation, onClose, lng, lat]);

  return (
    <Dialog icon="locate" title="Location" isOpen={isOpen} onClose={onClose}>
      <div className={Classes.DIALOG_BODY}>
        <FormGroup label="Lat" inline className="form-group">
          <NumericInput value={lat || ''} onValueChange={setLat} min={-90} max={+90} />
        </FormGroup>
        <FormGroup label="Lng" inline className="form-group">
          <NumericInput value={lng || ''} onValueChange={setLng} min={-180} max={+180} />
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleSubmit}>OK</Button>
        </div>
      </div>
    </Dialog>
  );
});
