import Papa from 'papaparse';
import fs from 'fs';
import axios from 'axios';

function writeFile() {
  const csvDownload = new Promise((res, rej) => {
    console.log('starting file download');
    const CSVWriteStream = fs.createWriteStream('./data/04-22-2020.csv');
    axios({
      method: 'get',
      url:
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-22-2020.csv',
      responseType: 'stream',
    })
      .then(response => {
        response.data.pipe(CSVWriteStream);
      })
      .catch(err => console.log(err));

    CSVWriteStream.on('finish', () => {
      res('file write is complete');
    });
  });
  return csvDownload;
}

function parseFile() {
  const csvData = new Promise((res, rej) => {
    const file = fs.createReadStream('./data/04-22-2020.csv', 'utf-8');
    const data = [];
    Papa.parse(file, {
      worker: true,
      header: true,
      step(result) {
        data.push(result.data);
      },
      complete() {
        res(data);
      },
    });
  });
  return csvData;
}

function jsonWriter(data) {
  const jsonData = new Promise((res, rej) => {
    console.log('starting to write file');
    const JSONWriteStream = fs.createWriteStream('./data/json/04-22-2020.json');

    JSONWriteStream.write(JSON.stringify(data), 'UTF-8');

    JSONWriteStream.on('finish', () => {
      console.log('wrote all data to file');
    });

    // close the stream
    res(JSONWriteStream.end());
  });
  return jsonData;
}

async function readData() {
  console.log('starting function');
  await writeFile();
  await console.log('file written, awaiting read');
  const data = await parseFile();
  await console.log(data.length);
  await jsonWriter(data);
}

readData();
