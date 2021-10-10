import http from 'http';
import { readFile } from 'fs';
import nlp from 'compromise';
import syntax from './index.js';

nlp.extend(syntax);

async function test() {
  await readFile('./sample.txt', 'utf8', (err, data) => {
    if (err) {
      throw new Error(err);
    }

    const doc = nlp(data);
    doc.syntax();
  });
}

function requestListener(req, res) {
  res.writeHead(200);
  test();
  res.end('Hello, World!');
}

const server = http.createServer(requestListener);
server.listen(8080);
