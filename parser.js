import * as mfs from './lib/filesystem.js';

export default function parser(doc) {
  function tagMatch(sentence, rule) {
    console.log('------------------------------');
    console.log(sentence.text());
    const {
      pattern, tag, untag, demark, tagID, replace,
    } = rule;

    if (pattern) {
      if (sentence.has(pattern)) {
        const matchedPattern = sentence.match(pattern);

        console.log('we have a match');
        console.log(matchedPattern.text());
        console.log(tag || untag || replace);
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

          if (tag.first) {
            const matchedTerm = matchedPattern.match(tag.first.term).first();
            matchedTerm.tag(tag.first.termTag);
          }

          if (tag.last) {
            const matchedTerm = matchedPattern.match(tag.last.term).last();
            matchedTerm.tag(tag.last.termTag);
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
          if (tagID.all) {
            matchedPattern.tagWithID(tag.all);
          }

          if (tagID.on) {
            const matchedTerm = matchedPattern.match(tagID.on.term);
            matchedTerm.tagWithID(tagID.on.termTag);
          }

          if (tagID.split) {
            const beforeTerm = matchedPattern.before(tagID.split.term);
            beforeTerm.tagWithID(tagID.split.termTag);
            const afterTerm = matchedPattern.after(tagID.split.term);
            afterTerm.tagWithID(tagID.split.termTag);
          }

          if (tagID.before) {
            const matchedTerm = matchedPattern.before(tagID.before.term);
            matchedTerm.tagWithID(tagID.before.termTag);
          }

          if (tagID.after) {
            const matchedTerm = matchedPattern.after(tagID.after.term);
            matchedTerm.tagWithID(tagID.after.termTag);
          }

          if (tagID.first) {
            const matchedTerm = matchedPattern.match(tagID.first.term).first();
            matchedTerm.tagWithID(tag.first.termTag);
          }

          if (tagID.last) {
            const matchedTerm = matchedPattern.match(tagID.last.term).last();
            matchedTerm.tagWithID(tag.last.termTag);
          }

          if (tagID.beginning) {
            matchedPattern.firstTerms().tagWithID(tagID.beginning);
          }

          if (tagID.ending) {
            matchedPattern.lastTerms().tagWithID(tagID.ending);
          }

          if (tagID.each) {
            tagID.each.forEach((item) => {
              const { term } = item;
              const { termTag } = item;
              const matchedTerm = matchedPattern.match(term);

              matchedTerm.tagWithID(termTag);
            });
          }

          if (tagID.eachTheSame) {
            tagID.eachTheSame.terms.forEach((term) => {
              const matchedTerm = matchedPattern.match(term);
              matchedTerm.tagWithID(tagID.eachTheSame.termTag);
            });
          }
        }

        if (replace) {
          if (replace.on) {
            const matchedTerm = matchedPattern.match(replace.on.term);
            if (matchedTerm.found) {
              const tags = matchedTerm.json({ terms: { bestTag: true } })[0].terms;
              const { bestTag } = tags[0];

              matchedTerm.untag(bestTag);
              matchedTerm.tag(replace.on.termTag);
            }
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

  // Process the document by sentences and then by non-list commas for intra-phrase...
  // Process by entire sentence for inter-phrase.
  const sentences = doc.sentences();
  sentences.forEach((sentence) => {
    orderedRules.forEach((rule) => {
      if (rule.type === 'intra-phrase') {
        let chunks = sentence;
        if (sentence.has('#Comma')) {
          const commas = sentence.match('#Comma');
          commas.forEach((comma) => {
            if (comma.ifNo('#List').found) {
              chunks = chunks.splitAfter(comma);
            }
          });
        }
        chunks.forEach((chunk) => {
          tagMatch(chunk, rule);
        });
      } else {
        tagMatch(sentence, rule);
      }
    });
  });
}
