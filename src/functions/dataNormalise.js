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

function statesUpdater(array) {
  array
    .filter(d => {
      const { provinceState, countryRegion, combinedKey } = d;
      return combinedKey === `${provinceState}-${countryRegion}`;
    })
    .forEach(a => {
      const allProvinceData = array.filter(i => i.provinceState === a.provinceState);
      const apdCaseValues = allProvinceData
        .map(apd => Object.entries(apd.caseData))
        .flat()
        .reduce((acc, item) => {
          let [date, value] = item;
          value = parseInt(value) ?? 0;
          if (typeof acc[date] === 'undefined') acc[date] = 0;
          acc[date] += value;
          return acc;
        }, {});
      a.caseData = apdCaseValues;
    });
}

function statesConverter(array) {
  array.forEach(obj => {
    Object.keys(obj.caseData).forEach(k => {
      obj.caseData[k] = `${obj.caseData[k]}`;
    });
  });
}

function arrayMaker(filePath) {
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
                combinedKey: combinedKey.replace(regex, '-').replace('Unassigned-', ''),
                caseData,
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
                caseData,
              });
            }
          } else {
            res(parsedData);
          }
        });
        statesUpdater(cleanedArray);
        statesConverter(cleanedArray);
        res(cleanedArray);
      });
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}

export default function() {
  return Promise.all(
    ['confirmed', 'deaths', 'recovered'].map(
      status =>
        new Promise(async (res, rej) => {
          try {
            const filePath = `./data/${status}.json`;
            const cleanedArray = await arrayMaker(filePath);
            await writeJSONFile(cleanedArray, filePath).then(() => res());
          } catch (err) {
            console.error(err);
            rej(err);
          }
        })
    )
  );
}
