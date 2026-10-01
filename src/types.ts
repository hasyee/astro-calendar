export type Timestamp = number;
export type Degrees = number;
export type Radians = number;

/** Time span; bounds are `-Infinity` / `Infinity` when open-ended (e.g. polar day/night). */
export type Interval = { start: Timestamp; end: Timestamp };

/** Geographic coordinates in degrees, as entered by the user. */
export type Coords = { lng: Degrees; lat: Degrees };

export type Place = { coords: Coords; name: string };

/** Geographic position in radians, as used by the calculators. */
export type Position = { lat: Radians; lon: Radians };

export type NightInfo = {
  night: Interval | null;
  moonNight: Interval | null;
  astroNight: Interval | null;
  moonlessNight: Interval | null;
  moonPhase: number;
  moonIllumination: number;
};

/** Start and end of a band as a fraction (0..1) of the day. */
export type Band = [start: number, end: number];

export type Bands = {
  night: Band[];
  astroNight: Band[];
  moonlessNight: Band[];
};

export type CalendarDay = {
  day: Timestamp;
  classNames?: string;
  info: NightInfo;
  moonPhase: number;
  bands: Bands;
};

/** Item of the Nominatim search API response (only the fields in use). */
export type NominatimPlace = { place_id: number; display_name: string; lon: string; lat: string };

/** Worker protocol */
export type CalcRequest = { jobId: number; date: Timestamp; weekOffset: number; location: Coords };
export type CalcResponse = { jobId: number; days: CalendarDay[] };
