import nlp from "compromise";
import disambiguation from "compromise.disambiguation";
import "./compromise-extensions.js";
import * as mfs from "./lib/filesystem.js";

export default function initialize(doc) {

  nlp.plugin(disambiguation);

  // const primeTheEngine = nlp('prime');
  // primeTheEngine.disambiguate();

  doc.disambiguate();

  const baseDir = "./rules/initialize/";
  const tagDir = `${baseDir}tags/`;
  const wordDir = `${baseDir}words/`;

  const tags = mfs.loadJSONDir(tagDir, "tags");
  const words = mfs.loadJSONDir(wordDir, "words");

  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$ Initialization");
  doc.addCustomTags(tags);
  doc.addCustomWords(words);

  console.log("Doc, post-Initialization");
  console.log(doc.debug());
}
