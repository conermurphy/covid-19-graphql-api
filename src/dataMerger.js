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
        data[fileName][cleanedDate] = i[1];
      }
    });
    const found = newConfirmedArray.find(
      el =>
        el.uniqueId ===
        `${d['Province/State'].replace(' ', '-')}${d['Province/State'] === '' ? '' : '-'}${d['Country/Region'].replace(' ', '-')}`
    );
    found[fileName] = data[fileName];
  });
}

writeJSONFile(newConfirmedArray, './data/timeSeriesReports/allTimeSeries.json');
