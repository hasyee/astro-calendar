import moment from 'moment';

export const toNoon = time => {
  return moment(time)
    .startOf('day')
    .hour(12)
    .valueOf();
};

export const toMidnight = time => {
  return moment(time)
    .startOf('day')
    .add(1, 'day')
    .valueOf();
};

export const toNextDay = time => {
  return moment(time)
    .add(1, 'day')
    .valueOf();
};

export const toPrevDay = time => {
  return moment(time)
    .subtract(1, 'day')
    .valueOf();
};
