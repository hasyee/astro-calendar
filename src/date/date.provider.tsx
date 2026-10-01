import { type PropsWithChildren } from 'react';
import StateProvider from '../provider/state.provider';
import { DateContext } from './date.hooks';

export default function DateProvider({ children }: PropsWithChildren<{}>) {
  return <StateProvider context={DateContext}>{children}</StateProvider>;
}
