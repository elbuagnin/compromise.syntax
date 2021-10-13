import * as mfs from './lib/filesystem.js';

export default function parser(doc) {
  function tagMatch(sentence, rule) {
    console.log('------------------------------');
    console.log(sentence.text());
    const {
      pattern, tag, untag, demark, tagID,
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
            untag.each.forEach((item) => {
              const { term } = item;
              const { termTag } = item;
              const matchedTerm = matchedPattern.match(term);
              if (matchedTerm.has(termTag)) {
                matchedTerm.untag(termTag);
              }
            });
          }
        }

        if (tag) {
          if (tag.all) {
            matchedPattern.tag(tag.all);
          }

          if (tag.on) {
            const matchedTerm = matchedPattern.match(tag.on.term);
            matchedTerm.tag(tag.on.termTag);
          }

          if (tag.split) {
            const beforeTerm = matchedPattern.before(tag.split.term);
            beforeTerm.tag(tag.split.termTag);
            const afterTerm = matchedPattern.after(tag.split.term);
            afterTerm.tag(tag.split.termTag);
          }

          if (tag.before) {
            const matchedTerm = matchedPattern.before(tag.before.term);
            matchedTerm.tag(tag.before.termTag);
          }

          if (tag.after) {
            const matchedTerm = matchedPattern.after(tag.after.term);
            matchedTerm.tag(tag.after.termTag);
          }

          if (tag.beginning) {
            matchedPattern.firstTerms().tag(tag.beginning);
          }

          if (tag.ending) {
            matchedPattern.lastTerms().tag(tag.ending);
          }
          if (tag.each) {
            tag.each.forEach((item) => {
              const { term } = item;
              const { termTag } = item;
              const matchedTerm = matchedPattern.match(term);

              matchedTerm.tag(termTag);
            });
          }
          if (tag.eachTheSame) {
            tag.eachTheSame.terms.forEach((term) => {
              const matchedTerm = matchedPattern.match(term);
              matchedTerm.tag(tag.eachTheSame.termTag);
            });
          }
        }

        if (tagID) {
          if (tag.all) {
            matchedPattern.tagWithID(tag.all);
          }

          if (tag.on) {
            const matchedTerm = matchedPattern.match(tag.on.term);
            matchedTerm.tagWithID(tag.on.termTag);
          }

          if (tag.split) {
            const beforeTerm = matchedPattern.before(tag.split.term);
            beforeTerm.tagWithID(tag.split.termTag);
            const afterTerm = matchedPattern.after(tag.split.term);
            afterTerm.tagWithID(tag.split.termTag);
          }

          if (tag.before) {
            const matchedTerm = matchedPattern.before(tag.before.term);
            matchedTerm.tagWithID(tag.before.termTag);
          }

          if (tag.after) {
            const matchedTerm = matchedPattern.after(tag.after.term);
            matchedTerm.tagWithID(tag.after.termTag);
          }

          if (tag.beginning) {
            matchedPattern.firstTerms().tagWithID(tag.beginning);
          }

          if (tag.ending) {
            matchedPattern.lastTerms().tagWithID(tag.ending);
          }
          if (tag.each) {
            tag.each.forEach((item) => {
              const { term } = item;
              const { termTag } = item;
              const matchedTerm = matchedPattern.match(term);

              matchedTerm.tagWithID(termTag);
            });
          }
          if (tag.eachTheSame) {
            tag.eachTheSame.terms.forEach((term) => {
              const matchedTerm = matchedPattern.match(term);
              matchedTerm.tagWithID(tag.eachTheSame.termTag);
            });
          }
        }

        if (demark) {
          if (demark.on) {
            const matchedTerm = matchedPattern.match(demark.on.term);
            matchedTerm.tag(demark.on.termTag);
          }
          if (demark.eachTheSame) {
            demark.eachTheSame.terms.forEach((term) => {
              const matchedTerm = matchedPattern.match(term);
              matchedTerm.tag(demark.eachTheSame.termTag);
            });
          }
          if (demark.beginning) {
            matchedPattern.firstTerms().tag(demark.beginning);
          }
          if (demark.ending) {
            matchedPattern.lastTerms().tag(demark.ending);
          }
        }
      }
    }
  }

  // Load the parsing rules and sort them by batch and withing batch.
  // Rule order is critical for correct assignments.
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

  // Process the document by sentences and then by assigned phrasing.
  const sentences = doc.sentences();
  sentences.forEach((sentence) => {
    orderedRules.forEach((rule) => {
      if (sentence.has('#SPLIT') || sentence.has('#BEGIN') || sentence.has('#END')) {
        let chunks = sentence.split('#SPLIT');
        chunks = chunks.splitBefore('#BEGIN');
        chunks = chunks.splitAfter('#END');
        chunks.forEach((chunk) => {
          tagMatch(chunk, rule);
        });
      } else {
        tagMatch(sentence, rule);
      }
    });
  });
}
