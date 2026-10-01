import createDays from './calculator';

self.onmessage = ({ data: { jobId, date, weekOffset, location } }) => {
  self.postMessage({ jobId, days: createDays(date, weekOffset, location) });
};
