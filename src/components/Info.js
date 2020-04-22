import React, { Fragment } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import './Info.scss';

export default React.memo(function Info(info) {
  const renderTransit = (name, interval, which) => (
    <Fragment key={which}>
      <td>{name}</td>
      <td>{interval && Number.isFinite(interval[which]) ? moment(interval[which]).format('ddd HH:mm') : '-'}</td>
    </Fragment>
  );

  const renderRow = (name, key, startName, endName) => (
    <tr>
      <td>
        <span className={classnames('dot', key)} /> {name}
      </td>
      {renderTransit(startName, info[key], 'start')}
      {renderTransit(endName, info[key], 'end')}
    </tr>
  );

  return (
    <div className="Info">
      <table>
        <tbody>
          <tr>
            <td colSpan={2}>Moon phase: {(info.moonPhase * 100).toFixed(0)}%</td>
            <td colSpan={3}>Moon illumination: {(info.moonIllumination * 100).toFixed(0)}%</td>
          </tr>
          {renderRow('Twilight', 'night', 'Sunset', 'Sunrise')}
          {renderRow('Astro night', 'astroNight', 'From', 'To')}
          {renderRow('Moon', 'moonNight', 'Moonset', 'Moonrise')}
          {renderRow('Moonless night', 'moonlessNight', 'From', 'To')}
        </tbody>
      </table>
    </div>
  );
});
