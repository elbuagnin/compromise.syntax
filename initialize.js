import nlp from "compromise";
import disambiguation from "compromise.disambiguation";
import * as rulesPath from "./rules-path.js";
import "./compromise-extensions.js";
import * as mfs from "./lib/filesystem.js";

export default function initialize(doc) {
  nlp.plugin(disambiguation);
  doc.disambiguate();

  const tags = mfs.loadJSONDir(rulesPath.tagDir, "tags");
  const words = mfs.loadJSONDir(rulesPath.wordDir, "words");

  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log("$$ Initialization");
  nlp.addTags(tags);
  nlp.addWords(words);

  console.log("Doc, post-Initialization");
  console.log(doc.debug());
}
