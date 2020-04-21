import Papa from 'papaparse';
import fs, { createReadStream } from 'fs';
import axios from 'axios';

// /* eslint-disable */
// const papaConfig = {
//   delimiter: "", // auto-detect
//   newline: "", // auto-detect
//   quoteChar: '"',
//   escapeChar: '"',
//   header: true,
//   transformHeader: undefined,
//   dynamicTyping: false,
//   preview: 5,
//   encoding: '',
//   worker: false,
//   comments: false,
//   step: undefined,
//   complete(results, file) {
//     console.log('Parsing complete:', results, file);
//   },
//   error: undefined,
//   download: true,
//   downloadRequestHeaders: undefined,
//   downloadRequestBody: undefined,
//   skipEmptyLines: false,
//   chunk: undefined,
//   fastMode: undefined,
//   beforeFirstChunk: undefined,
//   withCredentials: undefined,
//   transform: undefined,
//   delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],
// };
// /* eslint-enable */

function fileDownload() {
  console.log('starting file download');
  const CSVWriteStream = fs.createWriteStream('./data/04-20-2020.csv');
  return axios({
    method: 'get',
    url:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-20-2020.csv',
    responseType: 'stream',
  })
    .then(res => {
      res.data.pipe(CSVWriteStream);
    })
    .catch(err => console.log(err));
  // console.log('file download is complete');
}

function fileRead() {
  console.log('starting to read file');
  let data = '';
  const CSVReadSteam = fs.createReadStream('./data/04-20-2020.csv', 'utf-8');

  CSVReadSteam.on('data', chunk => {
    data += chunk;
  }).on('end', () => {
    console.log(data);
  });
}

async function readData() {
  await fileDownload();
  await fileRead();
}

readData();
