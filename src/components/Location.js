import React, { Fragment, useState, useCallback } from 'react';
import classnames from 'classnames';
import { Button, NumericInput, FormGroup, Dialog, Callout, Classes } from '@blueprintjs/core';
import { useCoords, useDebounce, useLocation, useMyLocation, useLocationShortName } from '../hooks';
import PlaceSearch from './PlaceSearch';
import './Location.scss';

export default React.memo(function Location() {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const locationShortName = useLocationShortName();

  const [coords] = useCoords();
  const [, setLocation] = useLocation(false);

  const [lng, setLng] = useDebounce(
    coords.lng,
    useCallback(lng => setLocation({ coords: { lng }, name: '' }), [setLocation])
  );

  const [lat, setLat] = useDebounce(
    coords.lat,
    useCallback(lat => setLocation({ coords: { lat }, name: '' }), [setLocation])
  );

  const { fetchLocation, isFetchingLocation, locationFetchingError } = useMyLocation(handleClose);

  return (
    <Fragment>
      <Button icon="locate" onClick={handleOpen} large>
        {locationShortName ? locationShortName.toUpperCase() : 'LOCATION'}
      </Button>

      <Dialog
        icon="locate"
        title="Location"
        isOpen={isOpen}
        onClose={handleClose}
        canOutsideClickClose={!isFetchingLocation}
      >
        <div className={classnames(Classes.DIALOG_BODY, 'Location')}>
          <PlaceSearch onSelectLocation={handleClose} />
          <div className="lat-lon">
            <FormGroup label="Longitude">
              <NumericInput
                large
                value={lng.toString() || ''}
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
                value={lat.toString() || ''}
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
    </Fragment>
  );
});
