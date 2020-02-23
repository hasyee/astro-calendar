import React from 'react';
import moment from 'moment';
import './Night.scss';

export default React.memo(function Night({ night, moonNight, astroNight, moonlessNight }) {
  console.log({ night, moonNight, astroNight, moonlessNight });
  return (
    <div className="Night">
      <div className="daylight" />
    </div>
  );
});
