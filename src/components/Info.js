import React from 'react';
import moment from 'moment';
import './Info.scss';

export default React.memo(function Info({ night, moonNight, astroNight, moonlessNight, moonPhase }) {
  return (
    <div className="Info">
      <div className="moon-phase">Moon phase: {(moonPhase * 100).toFixed(0)}%</div>
      <table>
        <tbody>
          <tr>
            <td>
              <span className="dot night" /> Night
            </td>
            <td>Sunset</td>
            <td>{night && Number.isFinite(night.start) ? moment(night.start).format('HH:mm') : '-'}</td>
            <td>Sunrise</td>
            <td>{night && Number.isFinite(night.end) ? moment(night.end).format('HH:mm') : '-'}</td>
          </tr>
          <tr>
            <td>
              <span className="dot" /> Astro night
            </td>
            <td>From</td>
            <td>{astroNight && Number.isFinite(astroNight.start) ? moment(astroNight.start).format('HH:mm') : '-'}</td>
            <td>To</td>
            <td>{astroNight && Number.isFinite(astroNight.end) ? moment(astroNight.end).format('HH:mm') : '-'}</td>
          </tr>
          <tr>
            <td>
              <span className="dot moon" /> Moon
            </td>
            <td>Moonrise</td>
            <td>{moonNight && Number.isFinite(moonNight.end) ? moment(moonNight.end).format('HH:mm') : '-'}</td>
            <td>Moonset</td>
            <td>{moonNight && Number.isFinite(moonNight.start) ? moment(moonNight.start).format('HH:mm') : '-'}</td>
          </tr>
          <tr>
            <td>
              <span className="dot moonlessNight" /> Moonless night
            </td>
            <td>From</td>
            <td>
              {moonlessNight && Number.isFinite(moonlessNight.start)
                ? moment(moonlessNight.start).format('HH:mm')
                : '-'}
            </td>
            <td>To</td>
            <td>
              {moonlessNight && Number.isFinite(moonlessNight.end) ? moment(moonlessNight.end).format('HH:mm') : '-'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
