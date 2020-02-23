import React from 'react';
import './Night.scss';

export default React.memo(function Night({ night, moonNight, astroNight, moonlessNight }) {
  const renderBand = (name, band, i) => (
    <div key={i} className={name} style={{ left: `${band[0] * 100}%`, right: `${(1 - band[1]) * 100}%` }} />
  );
  const renderBands = (name, bands) => bands.map((band, i) => renderBand(name, band, i));

  return (
    <div className="Night">
      <div className="daylight" />
      {renderBands('night', night)}
      {renderBands('astroNight', astroNight)}
      {renderBands('moonlessNight', moonlessNight)}
    </div>
  );
});
