import moment from 'moment';
import io from 'use.io';

export const date = io.state(
  moment()
    .startOf('month')
    .valueOf()
);
