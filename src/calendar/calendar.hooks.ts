import { useEffect, useMemo, useRef } from 'react';
import CalcWorker from '../calculator/calculator.worker?worker';
import type { CalcRequest, CalcResponse } from '../calculator/calculator.types';
import { useDate } from '../date/date.hooks';
import { useCoords } from '../location/location.hooks';
import type { CalendarDay } from '../calculator/calculator.types';
import { createStateContext, useStateSetter, useStateValue } from '../provider/state.hooks';

const noDays: CalendarDay[] = [];

export const CalendarContext = createStateContext<CalendarDay[]>(noDays);

export const useDays = () => useStateValue(CalendarContext);

export const useDaysSetter = () => useStateSetter(CalendarContext);

export const useWorker = () => {
  const jobId = useRef(0);
  const worker = useMemo(() => new CalcWorker(), []);
  const date = useDate();
  const coords = useCoords();
  const setDays = useDaysSetter();

  useEffect(() => {
    worker.onmessage = ({ data: result }: MessageEvent<CalcResponse>) => {
      if (!result.days || result.jobId !== jobId.current) return;
      setDays(result.days);
    };
  }, [worker, setDays]);

  useEffect(() => {
    const request: CalcRequest = { jobId: ++jobId.current, date, weekOffset: 1, location: coords };
    worker.postMessage(request);
  }, [worker, date, coords]);

  useEffect(() => () => worker.terminate(), [worker]);
};
