import { resolve } from 'path';
import { promises as fs } from 'fs';

// @Author https://stackoverflow.com/a/45130990/16726930
export const getFileNames = async function* (dir, fileType) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFileNames(res, fileType);
        } else if (res.substr(-5, 5) === fileType) { // a better way?
            yield res;
        }
    }
};

export const loadJSONFile = async function (file) {
    const jsonObj = await fs.readFile(file, 'utf8', (err, data) => {

        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            const jsonObj = JSON.parse(data);

            return jsonObj;
        }

    });
    return jsonObj;
};
