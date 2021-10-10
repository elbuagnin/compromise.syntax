import * as mfs from './lib/filesystem.js';

export default function parser(doc) {
  function tagMatch(ruleSet) {
    Object.keys(ruleSet).forEach((set) => {
      const { rules } = ruleSet[set];

      Object.values(rules).forEach((rule) => {
        const { pattern } = rule;

        let tag = '';
        if (rule.tag) { tag = rule.tag; }

        let untag = '';
        if (rule.untag) { untag = rule.untag; }

        if (pattern) {
          if (doc.has(pattern)) {
            const matchedPattern = doc.match(pattern);
            console.log(matchedPattern);
            if (untag) {
              if (untag.all) {
                matchedPattern.untag(untag.all);
              }
              if (untag.one) {
                const matchedTerm = matchedPattern.match(untag.one.term);
                matchedTerm.untag(untag.one.termTag);
              }
            }
            if (tag) {
              if (tag.all) {
                matchedPattern.syntaxTag(matchedPattern, tag.all);
              }
              if (tag.one) {
                const matchedTerm = matchedPattern.match(tag.one.term);
                matchedTerm.tag(tag.one.termTag);
              }
            }
          }
        }
      });
    });
  }

  const rulePath = './rules/parser/';
  const list = true;
  const ruleSets = mfs.loadJSONDir(rulePath, list);
  ruleSets.sort((a, b) => ((a.order > b.order) ? 1 : -1));

  ruleSets.forEach((ruleSet) => {
    tagMatch(ruleSet);
  });
}
