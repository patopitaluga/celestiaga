import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const asciiHello = fs.readFileSync(path.resolve(__dirname, './asciihello.txt'), 'utf8');
console.log('\x1b[31m'); // fgRed
console.log(asciiHello);
console.log('\x1b[0m'); // reset

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './views/index.html')); // without template engine.
});

app.listen((process.env.PORT || 3000), () => {
  console.log('App listening on port ' + (process.env.PORT || 3000));
});
