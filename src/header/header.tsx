import AppBar from '@mui/material/AppBar';
import Location from '../location/location';
import DateControls from '../date/date.controls';
import './header.scss';

export default function Header() {
  return (
    <AppBar position="static" color="inherit" elevation={2} className="Header">
      <Location />
      <div className="spacer" />
      <DateControls />
    </AppBar>
  );
}
