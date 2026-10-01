import moment from 'moment';
import type { Timestamp } from '../calculator/calculator.types';

export const defaultDate: Timestamp = moment().startOf('month').valueOf();
