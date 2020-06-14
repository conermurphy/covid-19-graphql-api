import Papa from 'papaparse';
import fs from 'fs';
import axios from 'axios';
import dateFetcher from './dateFetcher.js';
import writeJSONFile from './jsonWriter.js';
import dataMerger from './dataMerger.js';
import dataDeleter from './dataDeleter.js';
import usDataMerger from './usDataMerger.js';
import dataNormalise from './dataNormalise.js';

function downloadFile(url, filePath) {
  // Creating a new promise to download the file
  return new Promise((res, rej) => {
    try {
      const CSVWriteStream = fs.createWriteStream(filePath); // Opening a write stream to a new file
      axios({
        method: 'get',
        url, // URL to download file which is passed down from the parent function
        responseType: 'stream',
      })
        .then(response => {
          response.data.pipe(CSVWriteStream); // Pipe the response promise into the writeStream to write the file
        })
        .catch(err => console.log(err)); // Catch any errors

      CSVWriteStream.on('finish', () => {
        // On the finish of the writeStream resolve the promise to the present function
        res();
      });
    } catch (err) {
      rej(err);
    }
  });
}

function parseFile(filePath) {
  // Creating a new promise to parse the downloaded file from the downloadFile promise
  return new Promise((res, rej) => {
    try {
      const file = fs.createReadStream(filePath, 'utf-8'); // Opening a readStream to the location of the downloaded file in CSV Format
      const data = []; // Creating a new empty array to store the converted data in JSON format.
      Papa.parse(file, {
        worker: true,
        header: true, // Setting the first line of the file to be the keys in each JSON object
        step(result) {
          data.push(result.data); // On each chunk of data or step, push the data into the empty data array.
        },
        complete() {
          // console.log(data);
          res(data); // Once the file is fully parsed resolve the promise and pass in the data array to be returned to the parent function.
        },
      });
    } catch (err) {
      console.log(err);
      rej(err);
    }
  });
}

async function dataFetcher(url, filePath) {
  // return a new promise for the fetching of data, this is not 100% required as async promises will always return a promise but want to be clear.
  return new Promise(async (res, rej) => {
    try {
      // call the download file function with the passed in url and filepath from the calling functions below.
      await downloadFile(url, `${filePath}.csv`);
      // await the downloads to be complete before transforming the data and storing it in a value.
      const data = await parseFile(`${filePath}.csv`);
      // take the returned data and pipe it into a write stream and then once complete resolve this function.
      await writeJSONFile(data, `${filePath}.json`).then(() => res());
      // Once the writing promise resolves, this function will be resolved which if downloading the time series, will resolve that individual download but will be waiting on the others before resolving the main function and moving to merging the data.
    } catch (err) {
      console.error(err);
      rej(err);
    }
  });
}

function downloadDaily() {
  // return a new promise
  return new Promise((res, rej) => {
    try {
      // get todays date from the date function.
      const date = dateFetcher();

      // set download vars.
      const dailyReportURL = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date}.csv`;
      const dailyFileName = './data/dailyReport';

      // call the data fetching function to download the data
      dataFetcher(dailyReportURL, dailyFileName).then(() => res());
    } catch (err) {
      // catch errors.
      console.error(err);
      rej(err);
    }
  });
}

function downloadTimeSeries() {
  return Promise.all(
    // Return a promise.all for each of the looped over values returning a new promise
    ['confirmed', 'deaths', 'recovered'].map(
      status =>
        // return a new promise for each value looped over to be passed into the promise.all array
        new Promise((resolve, reject) => {
          try {
            // setting the file name using the values in the original array above.
            const timeSeriesFileName = `./data/${status}`;
            // setting the download URL.
            const timeSeriesURL = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${status}_global.csv`;

            // function to download the data from the url and convert it to JSON.
            dataFetcher(timeSeriesURL, timeSeriesFileName).then(() => {
              resolve(); // On completion of the data fetching and conversion, complete this promise in the promise.all array.
            });
          } catch (err) {
            // Catch any errors and log them.
            console.error(err);
            reject(err);
          }
        })
    )
  );
}

function downloadUSData() {
  return Promise.all(
    ['confirmed', 'deaths'].map(
      status =>
        new Promise((res, rej) => {
          try {
            const fileName = `./data/US-${status}`;
            const usURL = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${status}_US.csv`;

            dataFetcher(usURL, fileName).then(() => {
              res();
            });
          } catch (err) {
            console.error(err);
            rej(err);
          }
        })
    )
  );
}

async function dataFetcherWrapper() {
  await downloadDaily();
  await downloadTimeSeries();
  await downloadUSData();
  await usDataMerger();
  await dataNormalise();
  await dataMerger();
  await dataDeleter();
}

dataFetcherWrapper();
