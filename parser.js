import * as mfs from './lib/filesystem.js';

export default function parser(doc) {
  function tagMatch(sentence, rule) {
    const {
      pattern, tag, untag, demark,
    } = rule;

    if (pattern) {
      if (sentence.has(pattern)) {
        const matchedPattern = sentence.match(pattern);
        console.log('we have a match');
        console.log(matchedPattern.text());
        console.log(tag);
        console.log('\n');
        if (untag) {
          if (untag.all) {
            matchedPattern.untag(untag.all);
          }

          if (untag.on) {
            const matchedTerm = matchedPattern.match(untag.on.term);
            matchedTerm.untag(untag.on.termTag);
          }

          if (untag.each) {
            untag.each.terms.forEach((term) => {
              matchedPattern.syntaxTag(term, untag.each.termTag);
            });
          }
        }

        if (tag) {
          if (tag.all) {
            matchedPattern.syntaxTag(matchedPattern, tag.all);
          }

          if (tag.on) {
            const matchedTerm = matchedPattern.match(tag.on.term);
            matchedTerm.syntaxTag(tag.on.term, tag.on.termTag);
          }

          if (tag.split) {
            const beforeTerm = matchedPattern.before(tag.split.term);
            beforeTerm.syntaxTag(beforeTerm, tag.split.termTag);
            const afterTerm = matchedPattern.after(tag.split.term);
            afterTerm.syntaxTag(afterTerm, tag.split.termTag);
          }

          if (tag.before) {
            const matchedTerm = matchedPattern.before(tag.before.term);
            matchedTerm.syntaxTag(matchedTerm, tag.before.termTag);
          }

          if (tag.after) {
            const matchedTerm = matchedPattern.after(tag.after.term);
            matchedTerm.syntaxTag(matchedTerm, tag.after.termTag);
          }

          if (tag.beginning) {
            matchedPattern.firstTerms().syntaxTag(tag.beginning.termTag);
          }

          if (tag.ending) {
            matchedPattern.lastTerms().syntaxTag(tag.ending.termTag);
          }
          if (tag.each) {
            tag.each.terms.forEach((term) => {
              matchedPattern.syntaxTag(term, tag.each.termTag);
            });
          }
        }

        if (demark) {
          if (demark.on) {
            const matchedTerm = matchedPattern.match(demark.on.term);
            matchedTerm.tag(demark.on.term, demark.on.termTag);
          }
          if (demark.beginning) {
            matchedPattern.firstTerms().tag(demark.beginning.termTag);
          }
          if (demark.ending) {
            matchedPattern.lastTerms().tag(demark.ending.termTag);
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

  orderedRules.sort((a, b) => a.batchOrder - b.batchOrder || a.order - b.order);

  console.log(orderedRules);

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
