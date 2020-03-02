import React from 'react';
import svgOf from '../calculator/svg';
import './Moon.scss';

export default React.memo(function Moon({ phase }) {
  const svg = svgOf[phase.toFixed(2)];

  return <div className="Moon" style={{ backgroundImage: `url(${svg})` }} />;
});
