import leftpad from 'left-pad';

const { round, floor, abs, PI } = Math;

export const PI2 = 2 * PI;
export const COMPLETE_ARC_SECS = 1296000;
export const MILLISECONDS_OF_DAY = 86400000;
export const JULIAND_DATE_OF_UTC_EPOCH = 2440587.5;
export const JULIAN_DATE_OF_MILLENIUM = 2451545;

export const roundTo = decimals => {
  const precision = 10 ** decimals;
  return (value: number) => round(value * precision) / precision;
};

export const roundTo2 = roundTo(2);

export const fix = value => leftpad(round(abs(value)), 2, 0);

export const getSign = value => (value < 0 ? -1 : +1);

export const unSignedFloor = value => getSign(value) * floor(abs(value));

export const degToRad = deg => (deg / 360) * PI2;

export const radToDeg = rad => (rad / PI2) * 360;

export const normalizeRad = rad => {
  const r = rad % PI2;
  return r < 0 ? r + PI2 : r;
};

export const radToHours = rad => (normalizeRad(rad) / PI2) * 24;

export const hoursToRad = hours => (hours / 24) * PI2;

export const hmsToRad = ({ hour = 0, min = 0, sec = 0 }) => ((hour + min / 60 + sec / 3600) / 24) * PI2;

export const dmsToRad = ({ deg = 0, arcMin = 0, arcSec = 0 }) => degToRad(deg + arcMin / 60 + arcSec / 3600);

export const radToArcSec = (rad): ArcSec => ((rad % PI2) / PI2) * COMPLETE_ARC_SECS;

export const radToHms = rad => {
  const hourWithDecimals = radToHours(rad);
  const hour = floor(hourWithDecimals);
  const minWithDecimals = (hourWithDecimals - hour) * 60;
  const min = floor(minWithDecimals);
  const secWithDecimals = (minWithDecimals - min) * 60;
  const sec = roundTo2(secWithDecimals);
  return { hour, min, sec };
};

export const radToDms = rad => {
  const arcSecs = radToArcSec(rad);
  const arcMins = unSignedFloor(arcSecs / 60);
  const arcSec = roundTo2(arcSecs - arcMins * 60);
  const deg = unSignedFloor(arcMins / 60);
  const arcMin = round(arcMins - deg * 60);
  return { deg, arcMin, arcSec };
};

export const hmsToString = ({ hour, min, sec }) => `${fix(hour)}h ${fix(min)}m ${fix(sec)}s`;

export const dmsToString = ({ deg, arcMin, arcSec }) => {
  const isNegative = [deg, arcMin, arcSec].some(value => value < 0);
  return `${isNegative ? '-' : ''}${fix(deg)}° ${fix(arcMin)}' ${fix(arcSec)}"`;
};

export const radToHmsString = rad => hmsToString(radToHms(rad));

export const radToDmsString = rad => dmsToString(radToDms(rad));

export const timeToJulianDate = time => time / MILLISECONDS_OF_DAY + JULIAND_DATE_OF_UTC_EPOCH;

export const julianDateToTime = julianDate => (julianDate - JULIAND_DATE_OF_UTC_EPOCH) * MILLISECONDS_OF_DAY;

export const julianDateToEpochDayNumber = julianDate => julianDate - JULIAN_DATE_OF_MILLENIUM;

export const epochDayNumberToJulanDate = epochDayNumber => epochDayNumber + JULIAN_DATE_OF_MILLENIUM;

export const timeToEpochDayNumber = time => julianDateToEpochDayNumber(timeToJulianDate(time));

export const epochDayNumberToTime = epochDayNumber => epochDayNumberToJulanDate(julianDateToTime(epochDayNumber));

export const halfDayArcToString = ({ start, end }) =>
  `RISE: ${new Date(start).toLocaleString()} SET: ${new Date(end).toLocaleString()}`;

export const getLocation = (latitude, longitude) => ({
  lat: degToRad(latitude),
  lon: degToRad(longitude)
});
