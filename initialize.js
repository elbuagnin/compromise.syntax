import nlp from 'compromise';
import './compromise-extensions.js';
import * as mfs from './lib/filesystem.js';

async function loadJSONData(dir) {
  const fileType = '.json';
  let dataset = {};
  const files = await mfs.getFileNames(dir, fileType);
  files.forEach((file) => {
    dataset = mfs.loadJSONFile(file);
  });

  return dataset;
}

export default async function initialize() {
  const baseDir = './rules/initialize/';
  const tagDir = `${baseDir}tags/`;
  const wordDir = `${baseDir}words/`;

  let tags = await loadJSONData(tagDir, 'tags');
  let words = await loadJSONData(wordDir, 'words');

  tags = JSON.parse(tags);
  words = JSON.parse(words);

  const primer = nlp('');
  primer.addCustomTags(tags);
  primer.addCustomWords(words);
}
