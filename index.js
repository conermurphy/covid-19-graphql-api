import Papa from 'papaparse';
import fs from 'fs';
import axios from 'axios';

function writeFile() {
  console.log('starting file download');
  const CSVWriteStream = fs.createWriteStream('./data/04-21-2020.csv');
  axios({
    method: 'get',
    url:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-21-2020.csv',
    responseType: 'stream',
  })
    .then(res => {
      res.data.pipe(CSVWriteStream);
    })
    .catch(err => console.log(err));
  // console.log('file download is complete');
}

function readFile() {
  const file = fs.createReadStream('./data/04-21-2020.csv', 'utf-8');
  // const JSONfile = fs.createWriteStream('./data/json/04-21-2020.json', 'utf-8');

  const data = [];

  Papa.parse(file, {
    worker: true, // Don't bog down the main thread if its a big file
    header: true,
    step(result) {
      // console.log(result.data);
      data.push(result.data);
    },
    complete(results) {
      console.log(data);
    },
  });
}

async function readData() {
  await writeFile();
  await readFile();
}

readFile();
