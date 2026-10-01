import moment from 'moment';
import type { Band, Bands, CalendarDay, Interval, NightInfo, Timestamp } from './calculator.types';
import type { Coords } from '../location/location.types';
import { getNightInfo as getIntervals } from './calculator.night';
import { toPrevDay } from './calculator.time';

const DAY_IN_MINS = 24 * 60;

type IntervalName = 'night' | 'astroNight' | 'moonlessNight';

export type DayStub = { day: Timestamp; classNames?: string };

type DayInterval = [Timestamp, Timestamp];

export default (days: DayStub[], coords: Coords): CalendarDay[] => {
  const intervals = days.map(({ day }) => getIntervals(day, coords.lat, coords.lng, -18));
  return days.map((day, i) => ({
    ...day,
    info: intervals[i],
    moonPhase: intervals[i].moonPhase,
    bands: {
      night: getBandsOf(intervals, i, day.day, 'night', coords),
      astroNight: getBandsOf(intervals, i, day.day, 'astroNight', coords),
      moonlessNight: getBandsOf(intervals, i, day.day, 'moonlessNight', coords)
    } satisfies Bands
  }));
};

const getBandsOf = (intervals: NightInfo[], i: number, day: Timestamp, name: IntervalName, coords: Coords): Band[] => {
  return getBands(day, getIntervalOf(intervals, day, i - 1, name, coords), intervals[i][name]);
};

const getBands = (day: Timestamp, ...intervals: (Interval | null)[]): Band[] => {
  return intervals
    .map(interval => forceIntervalToDay(interval, day))
    .filter((interval): interval is DayInterval => !!interval)
    .map(bandToFraction);
};

const getIntervalOf = (
  intervals: NightInfo[],
  day: Timestamp,
  i: number,
  name: IntervalName,
  coords: Coords
): Interval | null => {
  return intervals[i] ? intervals[i][name] : getIntervals(toPrevDay(day), coords.lat, coords.lng, -18)[name];
};

// An open-ended bound (±Infinity) means the interval goes on beyond the day, so it is clamped to the day like any
// other date. An inverted interval (start after end) comes from days where the sun neither sets nor rises on one
// side of the night, i.e. there is no night to show.
const forceIntervalToDay = (interval: Interval | null, day: Timestamp): DayInterval | null => {
  if (!interval || interval.start > interval.end) return null;
  return [forceDateToday(interval.start, day), forceDateToday(interval.end, day)];
};

const forceDateToday = (date: Timestamp, day: Timestamp): Timestamp => {
  const startOfDay = moment(day).startOf('day').valueOf();
  const endOfDay = moment(day).endOf('day').valueOf();
  return Math.min(Math.max(date, startOfDay), endOfDay);
};

const bandToFraction = ([start, end]: DayInterval): Band => [timeToFraction(start), timeToFraction(end)];

const timeToFraction = (time: Timestamp): number => {
  const date = moment(time);
  const fraction = (date.hours() * 60 + date.minutes()) / DAY_IN_MINS;
  return 1 - fraction < 0.001 ? 1 : fraction;
};
