import nlp from "compromise";
import disambiguation from "compromise.disambiguation";
import path from "path";
import { fileURLToPath } from "url";
import "./compromise-extensions.js";
import * as mfs from "./lib/filesystem.js";

export default function initialize(doc) {
  nlp.plugin(disambiguation);
  doc.disambiguate();

  const here = fileURLToPath(new URL(".", import.meta.url));
  const initializeDir = "./rules/initialize/";
  const initDirPath = path.join(here, initializeDir);

  const tagDir = path.join(initDirPath, 'tags/');
  const wordDir = path.join(initDirPath, 'words/');

  const tags = mfs.loadJSONDir(tagDir, "tags");
  const words = mfs.loadJSONDir(wordDir, "words");

  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$ Initialization");
  nlp.addTags(tags);
  nlp.addWords(words);

  console.log("Doc, post-Initialization");
  console.log(doc.debug());
}
