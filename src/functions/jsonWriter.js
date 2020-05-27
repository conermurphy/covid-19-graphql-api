import fs from 'fs';

function writeJSONFile(data, filePath) {
  // Creating a new promise for the writing of the JSON file, with the passed in data from the parsing promise.
  return new Promise((res, rej) => {
    try {
      const JSONWriteStream = fs.createWriteStream(filePath); // Open up a new write stream to the new file in JSON folder for that day.

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

export default writeJSONFile;
