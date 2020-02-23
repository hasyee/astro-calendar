import React from 'react';
import moment from 'moment';
import './Night.scss';

const f = interval => {
  if (!interval) return;
  return {
    start: moment(interval.start).format('DD HH:mm'),
    end: moment(interval.end).format('DD HH:mm')
  };
};

export default React.memo(function Night({ night, moonNight, astroNight, moonlessNight }) {
  //console.log({ night: f(night), moonNight: f(moonNight), astroNight: f(astroNight), moonlessNight: f(moonlessNight) });
  return (
    <div className="Night">
      <div className="daylight" />
    </div>
  );
});
