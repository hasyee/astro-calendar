import type { Band, Bands as BandsData } from '../calculator/calculator.types';
import './calendar.bands.scss';

export default function Bands({ night, astroNight, moonlessNight }: BandsData) {
  const renderBand = (name: string, band: Band, i: number) => (
    <div key={i} className={name} style={{ left: `${band[0] * 100}%`, right: `${(1 - band[1]) * 100}%` }} />
  );
  const renderBands = (name: string, bands: Band[]) => bands.map((band, i) => renderBand(name, band, i));

  return (
    <div className="Bands">
      <div className="daylight" />
      {renderBands('night', night)}
      {renderBands('astroNight', astroNight)}
      {renderBands('moonlessNight', moonlessNight)}
    </div>
  );
}
