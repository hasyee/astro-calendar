import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Button, NumericInput, FormGroup, Dialog, Callout, Classes } from '@blueprintjs/core';
import { useCoords, useDebounce, useMyLocation } from '../hooks';
import PlaceSearch from './PlaceSearch';
import './Location.scss';

export default React.memo(function Location({ isOpen, onClose }) {
  const [coords, setCoords] = useCoords();
  const [lng, setLng] = useDebounce(value => setCoords([value, lat]), coords[0]);
  const [lat, setLat] = useDebounce(value => setCoords([lng, value]), coords[1]);

  /* useEffect(() => {
    //console.log('run effect', lng, coords[0], lat, coords[1], lng === coords[0], lat === coords[1]);
    if (lng !== coords[0]) setLng(coords[0]);
    if (lat !== coords[1]) setLat(coords[1]);
  }, [coords, lng, lat, setLng, setLat]); */

  const { fetchLocation, isFetchingLocation, locationFetchingError } = useMyLocation(onClose);

  console.log('render Location');

  return (
    <Dialog icon="locate" title="Location" isOpen={isOpen} onClose={onClose} canOutsideClickClose={!isFetchingLocation}>
      <div className={classnames(Classes.DIALOG_BODY, 'Location')}>
        <PlaceSearch onSelectLocation={onClose} />
        <div className="lat-lon">
          <FormGroup label="Longitude">
            <NumericInput
              large
              value={lng || ''}
              onValueChange={setLng}
              fill
              min={-180}
              max={+180}
              minorStepSize={0.0001}
              disabled={isFetchingLocation}
            />
          </FormGroup>
          <FormGroup label="Latitude">
            <NumericInput
              large
              value={lat || ''}
              onValueChange={setLat}
              fill
              min={-90}
              max={+90}
              minorStepSize={0.0001}
              disabled={isFetchingLocation}
            />
          </FormGroup>
        </div>

        {locationFetchingError && (
          <Callout icon={undefined} intent="danger">
            {locationFetchingError}
          </Callout>
        )}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button large onClick={fetchLocation} icon={'locate'} loading={isFetchingLocation}>
            USE MY LOCATION
          </Button>
        </div>
      </div>
    </Dialog>
  );
});
