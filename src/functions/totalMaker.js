import fs from 'fs';
import writeJSONFile from './jsonWriter.js';

function dataReducer(path) {
  return new Promise((res, rej) => {
    try {
      fs.readFile(path, 'utf-8', (err, data) => {
        const json = JSON.parse(data);
        const statusObj = json
          .filter(el => el.countryRegion !== 'US' || el.combinedKey === 'US')
          .map(i => Object.entries(i.caseData))
          .flat()
          .reduce((acc, item) => {
            let [date, value] = item;
            value = parseInt(value) ?? 0;
            if (typeof acc[date] === 'undefined') acc[date] = 0;
            acc[date] += value;
            return acc;
          }, {});
        res(statusObj);
      });
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}

function objLabeller(arr, status) {
  return new Promise((res, rej) => {
    try {
      const newObj = {};
      const state = status === 'deaths' ? 'dead' : status;
      newObj[state] = arr;
      res(newObj);
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}

function stringifyObj(obj) {
  return new Promise((res, rej) => {
    try {
      const stringedObj = Object.entries(obj).reduce((acc, item) => {
        const [s, d] = item;
        acc[s] = `${d}`;
        return acc;
      }, {});
      res(stringedObj);
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}

function objCreator(status) {
  return new Promise(async (res, rej) => {
    try {
      const filePath = `./data/${status}.json`;
      const convertObj = await dataReducer(filePath);
      res(convertObj);
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}

function totalArrayGenerator() {
  return Promise.all(
    ['confirmed', 'deaths', 'recovered'].map(
      status =>
        new Promise(async (res, rej) => {
          try {
            const arrData = await objCreator(status);
            const stringData = await stringifyObj(arrData);
            const labelledData = await objLabeller(stringData, status);
            res(labelledData);
          } catch (err) {
            console.error(err);
            rej(err);
          }
        })
    )
  );
}

function finalArrayReducer(arr) {
  return new Promise((res, rej) => {
    try {
      const newArr = arr.reduce((acc, item) => {
        const [[s, d]] = Object.entries(item);
        acc[s] = d;
        return acc;
      }, {});
      res(newArr);
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}

export default function() {
  return new Promise(async (res, rej) => {
    try {
      const finalArray = await totalArrayGenerator();
      const reducedFinalArray = await finalArrayReducer(finalArray);
      await writeJSONFile(reducedFinalArray, './data/timeSeriesTotals.json').then(() => res());
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}
