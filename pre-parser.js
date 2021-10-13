import * as mfs from './lib/filesystem.js';

export default function preParser(document) {
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

  function tagHyphenatedTerms() {
    const hyphenatedTerms = document.hyphenated();
    hyphenatedTerms.tag(['#Noun', 'Singular', 'Hyphenated']);
  }

  function tagParentheses() {
    const parenthesesGroups = document.parentheses();
    if (parenthesesGroups.found) {
      parenthesesGroups.firstTerms().tag('BEGIN');
      parenthesesGroups.lastTerms().tag('END');
      parenthesesGroups.tag('parenthesesGroup');
    }
  }

  function tagQuotations() {
    const quotationGroups = document.quotations();
    if (quotationGroups.found) {
      quotationGroups.firstTerms().tag('BEGIN');
      quotationGroups.lastTerms().tag('END');
      quotationGroups.tag('QuotationGroup');
    }
  }

  function tagDashGroups() {
    if (document.has('@hasDash')) {
      const sentences = document.sentences();
      sentences.forEach((sentence) => {
        const dashedWords = sentence.match('@hasDash');
        dashedWords.forEach((word, i) => {
          console.log(word);
          console.log(i);
          if ((i % 2) === 0) {
            const segment = sentence.splitAfter(word).last();
            console.log(segment);
            segment.firstTerms().tag('BEGIN');
            segment.lastTerms().tag('END');
            segment.tag('DashGroup');
          }
        });
      });
    }
  }

  // Custom tags & words
  const rulePath = './rules/pre-parser/';
  const dataset = mfs.loadJSONDir(rulePath);

  // Normalize the document for parsing.
  document.contractions().expand();
  tagHyphenatedTerms();
  assignValues(dataset);
  document.lists().tag('List');
  tagParentheses();
  tagQuotations();
  tagDashGroups();
}
