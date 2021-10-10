import { resolve } from 'path';
import { promises as fs } from 'fs';

export async function getFileNames(dir, fileType) {
  const filenames = [];
  const dirents = await fs.readdir(dir, { withFileTypes: true });
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

export async function loadJSONFile(file) {
  let jsonObj = await fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      jsonObj = JSON.parse(data);
    }
  });
  return jsonObj;
}
