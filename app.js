import http from "http";
import { readFile } from "fs";
import nlp from "compromise";
import * as syntax from "./index.js";

nlp.extend(syntax);

function test() {
  readFile("./sample.txt", "utf8", (err, data) => {
    if (err) {
      throw new Error(err);
    }
    nlp.plugin(syntax.syntaxPlugin);
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
