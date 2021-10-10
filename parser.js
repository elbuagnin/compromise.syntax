import * as mfs from './lib/filesystem.js';

export default async function preParser(document) {
  /* Development Options */
    let devBlockName = 'preParser'; // eslint-disable-line
    let devInfoOn = true; // eslint-disable-line
  // devBlock('preParser', devInfoOn); // eslint-disable-line
  /** ******************** */

  // devInfo(document, 'before rules', devInfoOn, devBlockName); // eslint-disable-line

  async function loadJSONData(dir) {
    const fileType = '.json';
    let dataset = {};
    const files = await mfs.getFileNames(dir, fileType);
    files.forEach((file) => {
      dataset = mfs.loadJSONFile(file);
    });

    return dataset;
  }

  function assignValues(data) {
    Object.values(data).forEach((rule) => {
      const { term } = rule;
      const { pattern } = rule;
      let tag = '';
      if (rule.tag) { tag = rule.tag; }
      let untag = '';
      if (rule.untag) { untag = rule.untag; }

      if (term && pattern) {
        if (document.has(pattern)) {
          const matchedTerm = document.match(pattern).match(term);

          if (untag) {
            matchedTerm.untag(untag);
          }
          if (tag) {
            matchedTerm.tag(tag);
          }
        }
      }
    });
  }

  document.contractions().expand();
  const rulePath = './rules/pre-parser/';
  let dataset = await loadJSONData(rulePath);
  dataset = JSON.parse(dataset);
  assignValues(dataset);

  devInfo(document, 'after rules', devInfoOn, devBlockName); // eslint-disable-line
}
