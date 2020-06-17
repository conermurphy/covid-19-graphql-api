import fs from 'fs';

function dataDeleter() {
  return Promise.all(
    ['confirmed', 'deaths', 'recovered', 'US-confirmed', 'US-deaths'].map(
      file =>
        new Promise((res, rej) => {
          try {
            fs.unlink(`./data/${file}.csv`, err => {
              if (err) throw err;
              console.log(`${file}.csv was deleted`);
            });
            if (file === 'dailyReport') {
              res();
              return;
            }
            fs.unlink(`./data/${file}.json`, err => {
              if (err) throw err;
              console.log(`${file}.json was deleted`);
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

export default dataDeleter;
