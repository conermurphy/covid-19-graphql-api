import confirmedData from '../data/timeSeriesReports/inputs/confirmed.json';
import deathData from '../data/timeSeriesReports/inputs/deaths.json';
import recoveredData from '../data/timeSeriesReports/inputs/recovered.json';
import writeJSONFile from './functions/jsonWriter.js';

const newConfirmedArray = [];

function countryPopulator(file) {
  file.forEach(data => {
    if (newConfirmedArray.some(el => el.provinceState === data['Province/State'] && el.countryRegion === data['Country/Region'])) {
      return;
    }
    newConfirmedArray.push({
      uniqueId: `${data['Province/State'].replace(' ', '-')}${data['Province/State'] === '' ? '' : '-'}${data['Country/Region'].replace(
        ' ',
        '-'
      )}`,
      provinceState: data['Province/State'],
      countryRegion: data['Country/Region'],
    });
  });
}

[confirmedData, deathData, recoveredData].forEach((data, index) => {
  countryPopulator(data);
  dataPopulator(data, index);
});

// console.log(newConfirmedArray);

function dataPopulator(file, index) {
  const fileName = {
    0: 'confirmed',
    1: 'dead',
    2: 'recovered',
  }[index];
  console.log(fileName);
}

// confirmedData.forEach(data => {
//   const confirmed = {
//     admin: {},
//     confirmed: {},
//   };

//   const arrayData = Object.entries(data);

//   arrayData.forEach(d => {
//     if (d[0] === 'Province/State') {
//       confirmed.admin.provinceState = d[1];
//     }
//     if (d[0] === 'Country/Region') {
//       confirmed.admin.countryRegion = d[1];
//     }
//     if (d[0].slice(0, 1).match(/^[0-9]/)) {
//       const cleanedDate = d[0]
//         .split('/')
//         .map(s => s.padStart(2, 0))
//         .join('');
//       confirmed.confirmed[cleanedDate] = d[1];
//     }
//   });

//   const found = newConfirmedArray.find(el => el.provinceState === data['Province/State'] && el.countryRegion === data['Country/Region']);
//   found.confirmed = confirmed.confirmed;
// });

// console.log(newConfirmedArray);

writeJSONFile(newConfirmedArray, './data/timeSeriesReports/allTimeSeries.json');
