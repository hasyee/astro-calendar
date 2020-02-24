export const fetch = () => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      response => resolve([Number(response.coords.longitude), Number(response.coords.latitude)]),
      error => reject(error),
      { timeout: 10000 }
    )
  );
};
