import { useEffect, useMemo, useRef } from 'react';
import CalcWorker from '../calculator/calculator.worker?worker';
import type { CalcRequest, CalcResponse } from '../calculator/calculator.types';
import { useDate } from '../date/date.hooks';
import { useCoords } from '../location/location.hooks';
import { days as daysState } from './calendar.state';

export const useDays = daysState.hook();

export const useWorker = () => {
  const jobId = useRef(0);
  const worker = useMemo(() => new CalcWorker(), []);
  const [, date] = useDate();
  const [, coords] = useCoords();
  const [days] = useDays();

  useEffect(() => {
    worker.onmessage = ({ data: result }: MessageEvent<CalcResponse>) => {
      if (!result.days || result.jobId !== jobId.current) return;
      days.set(result.days);
    };
  }, [worker, days]);

  useEffect(() => {
    const request: CalcRequest = { jobId: ++jobId.current, date, weekOffset: 1, location: coords };
    worker.postMessage(request);
  }, [worker, date, coords]);

  useEffect(() => () => worker.terminate(), [worker]);
};
