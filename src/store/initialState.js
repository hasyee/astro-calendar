import moment from 'moment';

const location = localStorage.getItem('location') ? JSON.parse(localStorage.getItem('location')) : [19, 47];

const date = moment()
  .startOf('month')
  .startOf('day')
  .valueOf();

export default {
  date,
  location
};
