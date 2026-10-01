import type { Timestamp } from '../calculator/calculator.types';
import { createStateContext, useStateSetter, useStateValue } from '../provider/state.hooks';
import { defaultDate } from './date.utils';

export const DateContext = createStateContext<Timestamp>(defaultDate);

export const useDate = () => useStateValue(DateContext);

export const useDateSetter = () => useStateSetter(DateContext);
