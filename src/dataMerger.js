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
    admin: {},
    confirmed: {},
  };

  const arrayData = Object.entries(data);

  arrayData.forEach(d => {
    if (d[0] === 'Province/State') {
      confirmed.admin.provinceState = d[1];
    }
    if (d[0] === 'Country/Region') {
      confirmed.admin.countryRegion = d[1];
    }
    if (d[0].slice(0, 1).match(/^[0-9]/)) {
      const cleanedDate = d[0]
        .split('/')
        .map(s => s.padStart(2, 0))
        .join('');
      confirmed.confirmed[cleanedDate] = d[1];
    }
  });

  newConfirmedArray.push(countryData);
  // console.log(countryData);
  console.log(confirmed);
  const found = newConfirmedArray.find(el => el.provinceState !== '' && el.provinceState === data['Province/State']);
  // found.confirmed = confirmed;
  // console.log(found);
});

// console.log(newConfirmedArray);
