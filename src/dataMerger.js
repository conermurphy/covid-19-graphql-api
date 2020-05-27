import confirmedData from '../data/timeSeriesReports/confirmed.json';
import deathData from '../data/timeSeriesReports/deaths.json';
import recoveredData from '../data/timeSeriesReports/recovered.json';

const newConfirmedArray = [];

confirmedData.forEach(data => {
  const countryData = {
    provinceState: data['Province/State'],
    countryRegion: data['Country/Region'],
  };

  const confirmed = {
    confirmed: {},
  };

  const arrayData = Object.entries(data);

  arrayData.forEach(d => {
    if (d[0].slice(0, 1).match(/^[0-9]/)) {
      const cleanedDate = d[0]
        .split('/')
        .map(s => s.padStart(2, 0))
        .join('');
      confirmed.confirmed[cleanedDate] = d[1];
    }
  });

  newConfirmedArray.push(countryData);
  console.log(confirmed);
  newConfirmedArray.forEach(item => {});
});

// console.log(newConfirmedArray);
