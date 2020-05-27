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
      uniqueId: `${data['Province/State'].replace(/([ ])/g, '-')}${data['Province/State'] === '' ? '' : '-'}${data[
        'Country/Region'
      ].replace(/([ ])/g, '-')}`,
      provinceState: data['Province/State'],
      countryRegion: data['Country/Region'],
    });
  });
}

function dataPopulator(file, index) {
  const fileName = {
    0: 'confirmed',
    1: 'dead',
    2: 'recovered',
  }[index];

  const data = {};
  data[fileName] = {};

  file.forEach(d => {
    const arrayData = Object.entries(d);
    arrayData.forEach(i => {
      if (i[0].slice(0, 1).match(/^[0-9]/)) {
        const cleanedDate = i[0]
          .split('/')
          .map(s => s.padStart(2, 0))
          .join('');
        data[fileName][cleanedDate] = i[1]; // eslint-disable-line
      }
    });
    const found = newConfirmedArray.find(
      el =>
        el.uniqueId ===
        `${d['Province/State'].replace(/([ ])/g, '-')}${d['Province/State'] === '' ? '' : '-'}${d['Country/Region'].replace(/([ ])/g, '-')}`
    );
    found[fileName] = data[fileName];
  });
}

// Looping over each file we imported
[confirmedData, deathData, recoveredData].forEach((data, index) => {
  countryPopulator(data); // function to add a unqiue list of countries to the array.
  dataPopulator(data, index); // populating data under each country as a sub object.
});

writeJSONFile(
  newConfirmedArray.sort((a, b) => {
    const nameA = a.uniqueId.toUpperCase();
    const nameB = b.uniqueId.toUpperCase();
    return nameA < nameB ? -1 : 1;
  }),
  './data/timeSeriesReports/allTimeSeries.json'
); // Sorting the array and writing the new array to a file.
