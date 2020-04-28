import Papa from 'papaparse';
import fs from 'fs';
import axios from 'axios';

function downloadFile(url, date) {
  // Creating a new promise to download the file
  return new Promise((res, rej) => {
    try {
      const CSVWriteStream = fs.createWriteStream(`./data/dailyReports/csv/${date}.csv`); // Opening a write stream to a new file
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
        res('file write is complete');
      });
    } catch (err) {
      rej(err);
    }
  });
}

function parseFile(date) {
  // Creating a new promise to parse the downloaded file from the downloadFile promise
  return new Promise((res, rej) => {
    try {
      const file = fs.createReadStream(`./data/dailyReports/csv/${date}.csv`, 'utf-8'); // Opening a readStream to the location of the downloaded file in CSV Format
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

function writeJSONFile(data, date) {
  // Creating a new promise for the writing of the JSON file, with the passed in data from the parsing promise.
  return new Promise((res, rej) => {
    try {
      const JSONWriteStream = fs.createWriteStream(`./data/dailyReports/json/${date}.json`); // Open up a new write stream to the new file in JSON folder for that day.

      JSONWriteStream.write(JSON.stringify(data), 'UTF-8'); // Write the data to the writeStream opened above, but first stringify the data to write it.

      JSONWriteStream.on('finish', () => {
        res(JSONWriteStream.end()); // On the finish event from the writeStream, close off the stream and resolve the promise.
      });
    } catch (err) {
      console.log(err);
      rej(err);
    }
    // console.log('starting to write file');
  });
}

function checkToDownload(date) {
  return new Promise((res, rej) => {
    try {
      const csvDirectory = './data/dailyReports/csv/';
      const csvFiles = [];

      fs.readdir(csvDirectory, (err, files) => {
        if (err) {
          return console.log(`Unable to read files in this directory: ${err}`);
        }

        files.forEach(
          file =>
            new Promise((resolve, reject) => {
              try {
                csvFiles.push(file);
                resolve(csvFiles);
              } catch (err) {
                reject(err);
              }
            })
        );
        // console.log(csvFiles);
        csvFiles.includes(`${date}.csv`) ? res(false) : res(true);
      });
    } catch (err) {
      rej(err);
    }
  });
}

export default async function dataFetcher(date) {
  const download = await checkToDownload(date);
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date}.csv`;
  download ? await downloadFile(url, date) : undefined;
  const data = await parseFile(date);
  await writeJSONFile(data, date);
}
