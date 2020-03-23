import createDays from './calculator';

export const calc = (jobId, date, weekOffset, location) => {
  const days = createDays(date, weekOffset, location);
  return { jobId, days };
};
