export const search = query =>
  fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&namedetails=1`)
    .then(resp => resp.json())
    .catch(error => []);
