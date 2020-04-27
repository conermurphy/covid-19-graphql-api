import express from 'express';
// import fs from 'fs';
import dataFetcher from './src/dataFetcher.js';

const app = express();

const getDate = () => {
  try {
    const day = new Date().getDate() - 1;
    const month = `0${new Date().getMonth() + 1}`;
    const year = new Date().getFullYear();
    const fullDate = `${month}-${day}-${year}`;
    return fullDate;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const currentDate = getDate();

dataFetcher(currentDate);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log('The Server is listening on port 3000'));
