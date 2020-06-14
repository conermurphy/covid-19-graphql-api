import fs from 'fs';
import writeJSONFile from './jsonWriter.js';

const regex = /([ ',])+/g;

function dateCleaner(dateArray) {
  return dateArray
    .map(r => {
      let cleanedDate = r[0];

      if (r[0].slice(0, 1).match(/[0-9]/g)) {
        cleanedDate = r[0]
          .split('/')
          .map(s => s.padStart(2, 0))
          .join('');
      }

      return [cleanedDate, r[1]];
    })
    .filter(el => el[0].slice(0, 1).match(/[0-9]/g))
    .reduce((acc, item) => {
      const [date, caseNum] = item;
      acc[date] = caseNum;
      return acc;
    }, {});
}

function arrayMaker(filePath, status) {
  return new Promise((res, rej) => {
    try {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        const cleanedArray = [];
        const parsedData = JSON.parse(data);
        parsedData.forEach(d => {
          if (!Object.prototype.hasOwnProperty.call(d, 'combinedKey')) {
            if (Object.prototype.hasOwnProperty.call(d, 'Combined/Key')) {
              const {
                'Province/State': provinceState,
                'Country/Region': countryRegion,
                Lat,
                Long_: Long,
                'Combined/Key': combinedKey,
                ...rest
              } = d;
              const restArray = Object.entries({ ...rest });
              const caseData = dateCleaner(restArray);
              cleanedArray.push({
                provinceState,
                countryRegion,
                combinedKey,
                [status]: caseData,
              });
            }
            if (!Object.prototype.hasOwnProperty.call(d, 'Combined/Key')) {
              const { 'Province/State': provinceState, 'Country/Region': countryRegion, Lat, Long, ...rest } = d;
              const restArray = Object.entries({ ...rest });
              const caseData = dateCleaner(restArray);
              cleanedArray.push({
                provinceState,
                countryRegion,
                combinedKey: `${countryRegion.replace(regex, '-')}${provinceState === '' ? '' : '-'}${provinceState.replace(regex, '-')}`,
                [status]: caseData,
              });
            }
          } else {
            res(parsedData);
          }
        });
        res(cleanedArray);
      });
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}

function dataNormalise() {
  return Promise.all(
    ['confirmed', 'deaths', 'recovered'].map(
      status =>
        new Promise(async (res, rej) => {
          try {
            const filePath = `./data/${status}.json`;
            const cleanedArray = await arrayMaker(filePath, status);
            await writeJSONFile(cleanedArray, filePath).then(() => res());
          } catch (err) {
            console.error(err);
            rej(err);
          }
        })
    )
  );
}

dataNormalise();
