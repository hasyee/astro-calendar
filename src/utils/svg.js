import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import svgToDataURL from 'svg-to-dataurl';

const getSvg = phase => {
  const d = getD(phase);
  const svgStr = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 150" width="100px" height="100px">
      <path className="moonback" fill="black" d="m100,0 a20,20 0 1,1 0,150 a20,20 0 1,1 0,-150" />
      <path className="moonlight" fill="white" d={d} />
    </svg>
  );
  return svgToDataURL(svgStr);
};

const getD = phase => {
  let sweep = [];
  let mag;
  if (phase <= 0.25) {
    sweep = [1, 0];
    mag = 20 - 20 * phase * 4;
  } else if (phase <= 0.5) {
    sweep = [0, 0];
    mag = 20 * (phase - 0.25) * 4;
  } else if (phase <= 0.75) {
    sweep = [1, 1];
    mag = 20 - 20 * (phase - 0.5) * 4;
  } else if (phase <= 1) {
    sweep = [0, 1];
    mag = 20 * (phase - 0.75) * 4;
  } else {
  }
  let d = 'm100,0 ';
  d = d + 'a' + mag + ',20 0 1,' + sweep[0] + ' 0,150 ';
  return (d = d + 'a20,20 0 1,' + sweep[1] + ' 0,-150');
};

const svgs = Array.from({ length: 101 })
  .map((_, i) => (i / 100).toFixed(2))
  .reduce((acc, phase) => ({ ...acc, [phase]: getSvg(phase) }), {});

window.svgs = svgs;

export default svgs;
