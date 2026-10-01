import type { CalcRequest, CalcResponse } from './calculator.types';
import createDays from './calculator';

self.onmessage = ({ data: { jobId, date, weekOffset, location } }: MessageEvent<CalcRequest>) => {
  const response: CalcResponse = { jobId, days: createDays(date, weekOffset, location) };
  self.postMessage(response);
};
