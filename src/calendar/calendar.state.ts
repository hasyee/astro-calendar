import io from 'use.io';
import type { CalendarDay } from '../calculator/calculator.types';

const noDays: CalendarDay[] = [];

export const days = io.state(noDays);
