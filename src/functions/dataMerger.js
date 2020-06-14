import fs from 'fs';
import writeJSONFile from './jsonWriter.js';

const newConfirmedArray = [];
const regex = /([ ',])+/g; // regex used for replacing all spaces, ', , to create the unique ID's.

// function to create an array of all the unique countries and provinces.
function countryPopulator(file) {
  file.forEach(({ provinceState, countryRegion, combinedKey }) => {
    // Looping over each file and accessing the objects inside it.
    if (newConfirmedArray.some(el => el.combinedKey === combinedKey)) {
      return;
    }
    // if no duplicate is found then push a new object to the array with the countries province, country and a custom unique id.
    newConfirmedArray.push({
      combinedKey,
      provinceState,
      countryRegion,
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

  file.forEach(d => {
    const { provinceState, countryRegion, combinedKey, caseData } = d;
    const arrayLocation = newConfirmedArray.find(el => el.combinedKey === combinedKey);
    arrayLocation[fileName] = caseData;
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
