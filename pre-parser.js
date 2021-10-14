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
        const totalDashes = dashedWords.length;

        dashedWords.forEach((word, i) => {
          if ((i % 2) === 0) {
            let segment = sentence.splitAfter(word).last();

            if (i < totalDashes) {
              const nextDash = segment.match('@hasDash');

              if (nextDash.next().found) {
                segment = segment.before(nextDash.next());
              }
            }

            segment.firstTerms().tag('BEGIN');
            segment.lastTerms().tag('END');
            segment.tag('DashGroup');
          }
        });
      });
    }
  }

  function tagPunctuation() {
    document.sentences().forEach((sentence) => {
      sentence.if('@hasPeriod').lastTerms().tag('Period');
      sentence.if('@hasQuestionMark').lastTerms().tag('QuestionMark');
      sentence.if('@hasExclamation').lastTerms().tag('ExclamationMark');

      sentence.match('@hasComma').tag('Comma');
      sentence.match('@hasSemicolon').tag('Semicolon');
      // sentence.match('@hasColon').tag('Colon'); // implement?
    });
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
  tagPunctuation();
}
