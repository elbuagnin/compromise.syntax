import { resolve } from 'path';
import { readFileSync as readFile, readdirSync as readDir } from 'fs';

export function getFileNames(dir, fileType) {
  const filenames = [];
  const dirents = readDir(dir, { withFileTypes: true });
  Object.values(dirents).forEach((dirent) => {
    const entry = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      getFileNames(entry, fileType);
    } else if (entry.substr(-5, 5) === fileType) { // a better way?
      filenames.push(entry);
    }
  });

  return filenames;
}

export function loadJSONFile(file) {
  let jsonObj = readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      jsonObj = JSON.parse(data);
    }
  });
  return jsonObj;
}

export function loadJSONDir(dir) {
  const fileType = '.json';
  let dataset = {};
  const files = getFileNames(dir, fileType);
  files.forEach((file) => {
    const data = loadJSONFile(file);
    dataset = Object.assign(dataset, JSON.parse(data));
  });

  return dataset;
}
