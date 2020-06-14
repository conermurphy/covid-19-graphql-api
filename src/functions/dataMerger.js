import fs from 'fs';
import writeJSONFile from './jsonWriter.js';

const newConfirmedArray = [];
const regex = /([ ',])+/g; // regex used for replacing all spaces, ', , to create the unique ID's.

// function to create an array of all the unique countries and provinces.
function countryPopulator(file) {
  file.forEach(data => {
    // Looping over each file and accessing the objects inside it.
    if (Object.prototype.hasOwnProperty.call(data, 'Combined/Key')) {
      if (newConfirmedArray.some(el => el.combinedKey === data['Combined/Key'].replace(regex, '-'))) {
        return;
      }
    } else if (newConfirmedArray.some(el => el.provinceState === data['Province/State'] && el.countryRegion === data['Country/Region'])) {
      // if a duplicate country / province is found exit the loop.
      return;
    }
    // if no duplicate is found then push a new object to the array with the countries province, country and a custom unique id.
    newConfirmedArray.push({
      combinedKey: Object.prototype.hasOwnProperty.call(data, 'Combined/Key')
        ? data['Combined/Key'].replace(regex, '-')
        : `${data['Country/Region'].replace(regex, '-')}${data['Province/State'] === '' ? '' : '-'}${data['Province/State'].replace(
            regex,
            '-'
          )}`,
      provinceState: data['Province/State'],
      countryRegion: data['Country/Region'],
    });
  });
}

// function to populate data into the objects created in the countryPopulator function.
function dataPopulator(file, index) {
  // Knowing what file has been passed into the array for the relevant object to be created.
  const fileName = {
    0: 'confirmed',
    1: 'dead',
    2: 'recovered',
  }[index];

  // creating a blank data object for us to push later on to the main array.
  const data = {};
  // creating a new sub-object on the data object.
  data[fileName] = {};

  file.forEach(d => {
    const { 'Province/State': provinceState, 'Country/Region': countryRegion, Lat, Long, ...caseData } = d;
    const dates = Object.entries({ ...caseData });
    const cleanedArray = dates
      .map(date => {
        let cleanedDate = date[0];
        if (date[0].slice(0, 1).match(/[0-9]/g)) {
          // padding the date so it is in 6 digit format like: 010120

          cleanedDate = date[0]
            .split('/')
            .map(s => s.padStart(2, 0))
            .join('');
        }
        return [cleanedDate, date[1]];
      })
      .reduce((acc, item) => {
        acc[item[0]] = item[1];
        return acc;
      }, {});

    const newObj = {
      combinedKey: Object.prototype.hasOwnProperty.call(d, 'Combined/Key')
        ? d['Combined/Key'].replace(regex, '-')
        : `${d['Country/Region'].replace(regex, '-')}${d['Province/State'] === '' ? '' : '-'}${d['Province/State'].replace(regex, '-')}`,
      provinceState,
      countryRegion,
      [fileName]: cleanedArray,
    };

    const found = newConfirmedArray.find(el =>
      el.combinedKey === Object.prototype.hasOwnProperty.call(d, 'Combined/Key')
        ? d['Combined/Key'].replace(regex, '-')
        : `${d['Country/Region'].replace(regex, '-')}${d['Province/State'] === '' ? '' : '-'}${d['Province/State'].replace(regex, '-')}`
    );

    console.log(found);

    found[fileName] = newObj[fileName];
  });
}

export default function() {
  return new Promise(async (res, rej) => {
    try {
      // Looping over each file we imported.
      await Promise.all(
        ['confirmed', 'deaths', 'recovered'].map(
          (file, index) =>
            new Promise((resolve, reject) => {
              try {
                fs.readFile(`./data/${file}.json`, 'utf-8', (err, data) => {
                  const json = JSON.parse(data);
                  countryPopulator(json); // function to add a unqiue list of countries to the array.
                  dataPopulator(json, index); // populating data under each country as a sub object.
                  resolve(newConfirmedArray);
                });
              } catch (err) {
                console.error(err);
                reject(err);
              }
            })
        )
      );

      // Sorting the populated array by uniqueId A-Z.
      const sortedArray = await newConfirmedArray.sort((a, b) => {
        const nameA = a.countryRegion.toUpperCase();
        const nameB = b.countryRegion.toUpperCase();
        return nameA < nameB ? -1 : 1;
      });

      res(writeJSONFile(sortedArray, './data/allTimeSeries.json')); // Writing the new array to a file.
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}
