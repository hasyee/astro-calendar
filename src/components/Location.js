import React, { useState, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import { Button, NumericInput, FormGroup, Dialog, Callout, Classes } from '@blueprintjs/core';
import { useSelector, useActions, getCoords } from '../store';
import { useDebounce } from '../hooks/debounce';
import PlaceSearch from './PlaceSearch';
import './Location.scss';

export default React.memo(function Location({ isOpen, onClose }) {
  const coords = useSelector(getCoords);
  const { setLocation } = useActions();
  const [lng, setLng, handleChangeLng] = useDebounce(value => setLocation([value, lat]), coords[0]);
  const [lat, setLat, handleChangeLat] = useDebounce(value => setLocation([lng, value]), coords[1]);

  useEffect(() => {
    setLng(coords[0]);
    setLat(coords[1]);
  }, [coords, setLng, setLat]);

  const { isFetchingLocation, locationFetchingError, handleUseMyLocation } = useMyLocation(onClose);

  return (
    <Dialog icon="locate" title="Location" isOpen={isOpen} onClose={onClose} canOutsideClickClose={!isFetchingLocation}>
      <div className={classnames(Classes.DIALOG_BODY, 'Location')}>
        <PlaceSearch onSelectLocation={onClose} />
        <div className="lat-lon">
          <FormGroup label="Longitude">
            <NumericInput
              value={lng || ''}
              onValueChange={handleChangeLng}
              fill
              min={-180}
              max={+180}
              minorStepSize={0.0001}
              disabled={isFetchingLocation}
            />
          </FormGroup>
          <FormGroup label="Latitude">
            <NumericInput
              value={lat || ''}
              onValueChange={handleChangeLat}
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
          <Button onClick={handleUseMyLocation} icon={'locate'} loading={isFetchingLocation}>
            USE MY LOCATION
          </Button>
        </div>
      </div>
    </Dialog>
  );
});

const useMyLocation = onClose => {
  const { fetchLocation, setLocation } = useActions();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationFetchingError, setLocationFetchingError] = useState(null);

  const handleUseMyLocation = useCallback(async () => {
    try {
      setIsFetchingLocation(true);
      const coords = await fetchLocation();
      setLocation(coords);
      onClose();
    } catch (error) {
      setLocationFetchingError(error.message);
    } finally {
      setIsFetchingLocation(false);
    }
  }, [setIsFetchingLocation, fetchLocation, setLocation, onClose]);

  return { isFetchingLocation, locationFetchingError, handleUseMyLocation };
};
