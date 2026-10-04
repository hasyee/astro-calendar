import { Fragment, useState, useCallback } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useLocation, useLocationSetter, useMyLocation, useLocationShortName } from './location.hooks';
import CoordinateInput from './location.coordinate';
import PlaceSearch from './location.search';
import './location.scss';

export default function Location() {
  const locationShortName = useLocationShortName();
  const { coords } = useLocation();
  const setLocation = useLocationSetter();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const { fetchLocation, isFetchingLocation, locationFetchingError } = useMyLocation(handleClose);

  const handleLngChange = useCallback(
    (lng: number) => setLocation(location => ({ coords: { ...location.coords, lng }, name: '' })),
    [setLocation]
  );
  const handleLatChange = useCallback(
    (lat: number) => setLocation(location => ({ coords: { ...location.coords, lat }, name: '' })),
    [setLocation]
  );

  return (
    <Fragment>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<MyLocationIcon />}
        onClick={handleOpen}
        className="location-button-with-text"
      >
        <span className="label">{locationShortName ? locationShortName.toUpperCase() : 'LOCATION'}</span>
      </Button>
      <IconButton color="inherit" onClick={handleOpen} className="location-button-without-text">
        <MyLocationIcon />
      </IconButton>

      <Dialog
        open={isOpen}
        onClose={isFetchingLocation ? undefined : handleClose}
        fullWidth
        maxWidth="xs"
        className="Location"
      >
        <DialogTitle>Location</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <PlaceSearch onSelectLocation={handleClose} />
          <div className="lat-lon">
            <CoordinateInput
              label="Longitude"
              value={coords.lng}
              min={-180}
              max={180}
              disabled={isFetchingLocation}
              onChange={handleLngChange}
            />
            <CoordinateInput
              label="Latitude"
              value={coords.lat}
              min={-90}
              max={90}
              disabled={isFetchingLocation}
              onChange={handleLatChange}
            />
          </div>

          {locationFetchingError && <Alert severity="error">{locationFetchingError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={fetchLocation}
            startIcon={<MyLocationIcon />}
            loading={isFetchingLocation}
            loadingPosition="start"
          >
            Use my location
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
