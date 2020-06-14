import fs from 'fs';

export default function() {
  return Promise.all(
    ['confirmed', 'deaths'].map(
      status =>
        new Promise((res, rej) => {
          try {
            const usFileName = `./data/US-${status}.json`;
            const finalFileName = `./data/${status}.json`;

            const originalData = JSON.parse(fs.readFileSync(finalFileName));
            const usData = JSON.parse(fs.readFileSync(usFileName));
            originalData.push(...usData);

            const ws = fs.createWriteStream(finalFileName);
            ws.write(JSON.stringify(originalData), 'UTF-8');
            ws.end();
            ws.on('finish', () => res());
          } catch (err) {
            console.error(err);
            rej(err);
          }
        })
    )
  );
}
