import * as mfs from './lib/filesystem.js';

export default function parser(doc) {
  function tagMatch(sentence, rule) {
    const { pattern, tag, untag } = rule;

    if (pattern) {
      if (sentence.has(pattern)) {
        const matchedPattern = sentence.match(pattern);
        console.log('we have a match');
        console.log(matchedPattern.text());
        console.log(tag);
        console.log(tag.all);
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
  }

  const rulePath = './rules/parser/';
  const list = true;
  const ruleSets = mfs.loadJSONDir(rulePath, list);
  const orderedRules = [];
  Object.values(ruleSets).forEach((ruleSet) => {
    Object.values(ruleSet).forEach((rule) => {
      orderedRules.push(rule);
    });
  });

  orderedRules.sort((a, b) => ((a.order > b.order) ? 1 : -1));

  const sentences = doc.sentences();
  sentences.forEach((sentence) => {
    orderedRules.forEach((rule) => {
      if (sentence.has('#CompoundConjunction')) {
        const clauses = sentence.splitBefore('#CompoundConjunction');
        clauses.forEach((clause) => {
          tagMatch(clause, rule);
        });
      } else {
        tagMatch(sentence, rule);
      }
    });
  });
}
