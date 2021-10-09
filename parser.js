import * as mfs from './lib/filesystem.js';

export default async function preParser(document) {
    /* Development Options */
    let devBlockName = 'preParser'; // eslint-disable-line
    let devInfoOn = true; // eslint-disable-line
    devBlock('preParser', devInfoOn); // eslint-disable-line
    /***********************/

    async function loadJSONData(dir) {
        const fileType = '.json';

        for await (const file of mfs.getFileNames(dir, fileType)) {
            let dataset = await mfs.loadJSONFile(file);
            return dataset;
        }
    }

    devInfo(document, 'before rules', devInfoOn, devBlockName); // eslint-disable-line

    document.contractions().expand();

    const rulePath = './rules/';
    let dataset = await loadJSONData (rulePath);

    Object.values(JSON.parse(dataset)).forEach(rule => {
        let term = rule.term;
        let pattern = rule.pattern;
        let tag = '';
        if (rule.tag) { tag = rule.tag; }
        let untag = '';
        if (rule.untag) { untag = rule.untag; }

        if (term && pattern) {
            if (document.has(pattern)) {
                let matchedTerm = document.match(pattern).match(term);

                if (untag) {
                   matchedTerm.untag(untag);
                }
                if (tag) {
                   matchedTerm.tag(tag);
                }
            }
        }
    });

    devInfo(document, 'after rules', devInfoOn, devBlockName); // eslint-disable-line
}
