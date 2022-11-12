import http from "http";
import { readFile } from "fs";
import nlp from "compromise";
import syntax from "./index.js";

function test() {
  readFile("./sample.txt", "utf8", (err, data) => {
    if (err) {
      throw new Error(err);
    }
    nlp.plugin(syntax);

    const primeTheEngine = nlp('prime');
    primeTheEngine.syntax();

    const doc = nlp(data);
    doc.syntax();
  });
}

function requestListener(req, res) {
  res.writeHead(200);
  test();
  res.end("Hello, World!");
}

const server = http.createServer(requestListener);
server.listen(8080);
