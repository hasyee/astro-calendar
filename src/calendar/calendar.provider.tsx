import { type PropsWithChildren } from 'react';
import StateProvider from '../provider/state.provider';
import { CalendarContext } from './calendar.hooks';

export default function CalendarProvider({ children }: PropsWithChildren<{}>) {
  return <StateProvider context={CalendarContext}>{children}</StateProvider>;
}
