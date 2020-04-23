import Papa from 'papaparse';
import fs from 'fs';
import axios from 'axios';

function downloadFile(url, date) {
  // Creating a new promise to download the file
  const csvDownload = new Promise((res, rej) => {
    // console.log('starting file download');
    const CSVWriteStream = fs.createWriteStream(`./data/csv/${date}.csv`); // Opening a write stream to a new file

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
  });
  return csvDownload;
}

function parseFile(date) {
  // Creating a new promise to parse the donwloaded file from the downloadFile promise
  const csvData = new Promise((res, rej) => {
    const file = fs.createReadStream(`./data/csv/${date}.csv`, 'utf-8'); // Opening a readStream to the location of the downloaded file in CSV Format
    const data = []; // Creating a new empty array to store the converted data in JSON format.
    Papa.parse(file, {
      worker: true,
      header: true, // Setting the first line of the file to be the keys in each JSON object
      step(result) {
        data.push(result.data); // On each chunk of data or step, push the data into the empty data array.
      },
      complete() {
        res(data); // Once the file is fully parsed resolve the promise and pass in the data array to be returned to the parent function.
      },
    });
  });
  return csvData;
}

function writeJSONFile(data, date) {
  // Creating a new promise for the writing of the JSON file, with the passed in data from the parsing promise.
  const jsonData = new Promise((res, rej) => {
    // console.log('starting to write file');
    const JSONWriteStream = fs.createWriteStream(`./data/json/${date}.json`); // Open up a new write stream to the new file in JSON folder for that day.

    JSONWriteStream.write(JSON.stringify(data), 'UTF-8'); // Write the data to the writeStream opened above, but first stringify the data to write it.

    JSONWriteStream.on('finish', () => {
      res(JSONWriteStream.end()); // On the finish event from the writeStream, close off the stream and resolve the promise.
    });
  });
  return jsonData;
}

// function to get the date before downloading so don't need to manually change the date each day.
function getDate() {
  const datePromise = new Promise((res, rej) => {
    const day = new Date().getDate() - 1;
    const month = `0${new Date().getMonth() + 1}`;
    const year = new Date().getFullYear();
    const fullDate = `${month}-${day}-${year}`;
    res(fullDate);
  });
  return datePromise;
}

async function getNewData() {
  const date = await getDate();
  // console.log(date);
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date}.csv`;
  // console.log(url);
  await downloadFile(url, date);
  const data = await parseFile(date);
  await writeJSONFile(data, date);
}

getNewData();
