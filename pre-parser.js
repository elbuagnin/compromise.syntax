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
    const sentenceEndPunctuation = '(@hasPeriod|@hasQuestionMark|@hasExclamation)';
    document.sentences().forEach((sentence) => {
      if (sentence.parentheses().found) {
        console.log('p found');
        const parentheticals = sentence.parentheses();
        parentheticals.forEach((segment) => {
          console.log(`segment:${segment}`);
          sentence.replace(segment, '');
          if (!sentence.has(sentenceEndPunctuation)) {
            console.log('no punct');
            if (segment.has(sentenceEndPunctuation)) {
              console.log('segment has punct');
              const punctuation = segment.match(sentenceEndPunctuation);
              console.log(`==> ${punctuation} <==`);
              console.log(punctuation.text());
              sentence.post(punctuation);
            } else {
              console.log('using period');
              sentence.post('.');
            }
          }
        });
      }
    });
  }

  function tagQuotations() {
    const quotationGroups = document.quotations();
    quotationGroups.firstTerms().tag('BEGIN');
    quotationGroups.lastTerms().tag('END');
    quotationGroups.tag('QuotationGroup');
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
  document.if('@hasDash').tag('SPLIT');
}
