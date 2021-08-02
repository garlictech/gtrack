export const weather = {
  cod: '200',
  message: 0.0032,
  cnt: 40,
  city: {
    id: 3046343,
    name: 'Pilisszentkereszt',
    coord: {
      lat: 47.6914,
      lon: 18.905,
    },
    country: 'HU',
    population: 2224,
  },
  list: [
    {
      dt: 1514800800, // 2018-01-01 11:00:00
      main: {
        temp: 5.84,
        temp_min: 5.84,
        temp_max: 6.44,
        pressure: 984.76,
        sea_level: 1013.32,
        grnd_level: 984.76,
        humidity: 98,
        temp_kf: -0.6,
      },
      weather: [
        {
          id: 500,
          main: 'Rain',
          description: 'light rain',
          icon: '10n',
        },
      ],
      clouds: {
        all: 92,
      },
      wind: {
        speed: 5.51,
        deg: 52.0009,
      },
      rain: {
        '3h': 2.105,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2018-01-01 10:00:00',
    },
  ],
};
