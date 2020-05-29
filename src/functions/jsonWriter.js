import fs from 'fs';

export default function(data, filePath) {
  // Creating a new promise for the writing of the JSON file, with the passed in data from the parsing promise.
  return new Promise((res, rej) => {
    try {
      const JSONWriteStream = fs.createWriteStream(filePath); // Open up a new write stream to the new file in JSON folder for that day.

      JSONWriteStream.write(JSON.stringify(data), 'UTF-8'); // Write the data to the writeStream opened above, but first stringify the data to write it.

      JSONWriteStream.end(); // Calling .end() once the write is complete, then fire the 'finish' event, previously was calling the .end() method inside the 'finish' event which was causing a host of issues as not correct syntax.

      JSONWriteStream.on('finish', () => res()); // On finish resolve the writing promise.
    } catch (err) {
      console.log(err);
      rej(err);
    }
    // console.log('starting to write file');
  });
}
