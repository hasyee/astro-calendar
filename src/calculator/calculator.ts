import moment from 'moment';
import type { CalendarDay, Timestamp } from './calculator.types';
import type { Coords } from '../location/location.types';
import calcBands, { type DayStub } from './calculator.bands';

export default (timestamp: Timestamp, weekOffset = 0, location: Coords): CalendarDay[] => {
  const date = moment(timestamp);
  const startOfMonth = moment(date).startOf('month');

  const diff = (startOfMonth.weekday() - weekOffset + 7) % 7;

  const prevMonthDays: DayStub[] = Array.from({ length: diff }, (_, i) => ({
    day: startOfMonth
      .clone()
      .subtract(diff - i, 'days')
      .valueOf(),
    classNames: 'prevMonth'
  }));

  const currentMonthDays: DayStub[] = Array.from({ length: date.daysInMonth() }, (_, i) => ({
    day: moment([date.year(), date.month(), i + 1]).valueOf()
  }));

  const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;
  const nextMonthLength = (7 - ((daysAdded + 1) % 7)) % 7;

  const nextMonthDays: DayStub[] = Array.from({ length: nextMonthLength }, (_, i) => ({
    day: moment(currentMonthDays[currentMonthDays.length - 1].day)
      .add(i + 1, 'days')
      .valueOf(),
    classNames: 'nextMonth'
  }));

  return calcBands([...prevMonthDays, ...currentMonthDays, ...nextMonthDays], location);
};
