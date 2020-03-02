import moment from 'moment';
import { getNightInfo as getIntervals } from './getNightInfo';
import { toPrevDay } from './time';

const DAY_IN_MINS = 24 * 60;

export default (days, coords) => {
  const intervals = days.map(({ day }) => ({
    day,
    ...getIntervals(day, coords.lat, coords.lng, -18)
  }));
  return days.map((day, i) => ({
    ...day,
    info: intervals[i],
    moonPhase: intervals[i].moonPhase,
    bands: {
      night: getBandsOf(intervals, i, day.day, 'night', coords),
      astroNight: getBandsOf(intervals, i, day.day, 'astroNight', coords),
      moonlessNight: getBandsOf(intervals, i, day.day, 'moonlessNight', coords)
    }
  }));
};

const getBandsOf = (intervals, i, day, name, coords) => {
  return getBands(day, getIntervalOf(intervals, day, i - 1, name, coords), intervals[i][name]);
};

const getBands = (day, ...intervals) => {
  //console.log({ day, bands: intervals.map(interval => forceIntervalToDay(interval, day)) });
  const bands = intervals
    .map(interval => forceIntervalToDay(interval, day))
    .filter(_ => _)
    .map(bandToFraction);
  //console.log(bands);
  return bands;
};

const getIntervalOf = (intervals, day, i, name, coords) => {
  return intervals[i] ? intervals[i][name] : getIntervals(toPrevDay(day), coords.lat, coords.lng, -18)[name];
};

const forceIntervalToDay = (interval, day) => {
  if (!interval) return null;
  return [forceDateToday(interval.start, day), forceDateToday(interval.end, day)];
};

const forceDateToday = (date, day) => {
  if (!Number.isFinite(date)) return null;
  if (moment(date).isSame(moment(day), 'day')) return date;
  if (moment(date).isBefore(moment(day), 'day'))
    return moment(day)
      .startOf('day')
      .valueOf();
  if (moment(date).isAfter(moment(day), 'day'))
    return moment(day)
      .endOf('day')
      .valueOf();
};

const bandToFraction = band => band.map(timeToFraction);

const timeToFraction = time => {
  const date = moment(time);
  const fraction = (date.hours() * 60 + date.minutes()) / DAY_IN_MINS;
  return 1 - fraction < 0.001 ? 1 : fraction;
};
