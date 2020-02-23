import moment from 'moment';
import { getNightInfo as getIntervals } from './getNightInfo';

export default (days, location) => {
  const intervals = days.map(({ day }) => ({
    day,
    ...getIntervals(day, location[1], location[0], -18)
  }));
  return days.map((day, i) => ({
    ...day,
    moonPhase: intervals[i].moonPhase,
    night: getBandsOf(intervals, i, day.day, 'night')
  }));
};

const getBandsOf = (intervals, i, day, name) => {
  return getBands(
    day.day,
    intervals[i]['night'],
    getIntervalOf(intervals, day, i, -1, 'night'),
    getIntervalOf(intervals, day, i, +1, 'night')
  );
};

const getBands = (day, interval, prevInterval, nextInterval) => {};

const getDay = (day, updater) =>
  moment(day)
    .add(updater, 'days')
    .valueOf();

const getIntervalOf = (intervals, day, index, updater, name) =>
  intervals[index + updater] ? intervals[index + updater][name] : getIntervals(getDay(day, updater))[name];
