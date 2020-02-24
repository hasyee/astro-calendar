export const fetch = () => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      response => resolve([response.coords.longitude.toFixed(4), response.coords.latitude.toFixed(4)]),
      error => reject(error),
      { timeout: 10000 }
    )
  );
};
