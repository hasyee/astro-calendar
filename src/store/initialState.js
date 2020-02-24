import moment from 'moment';

const location = localStorage.getItem('location')
  ? JSON.parse(localStorage.getItem('location'))
  : { coords: [19, 47], name: '' };

const date = moment()
  .startOf('month')
  .startOf('day')
  .valueOf();

export default {
  date,
  location
};
