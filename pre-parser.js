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
          console.log('\nPreparser:');
          console.log(matchedTerm.text());

          if (untag) {
            matchedTerm.untag(untag);
            console.log(`Removing tag: ${untag}`);
          }
          if (tag) {
            matchedTerm.tag(tag);
            console.log(`Assigning tag: ${tag}`);
          }
        }
      }
    });
  }

  function compromiseInfinitivesToSyntaxFiniteVerbs() {
    document.match('#Infinitive').tag('#FiniteVerb').untag('#Infinitive');
    document.match('to #FiniteVerb').tag('#Infinitive').untag(['#Verb', '#FiniteVerb', '#PresentTense']);
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

  // Custom tags & words & disambiguation
  // Rule order is critical for correct assignments.
  const rulePath = './rules/pre-parser/';
  const list = true;
  const ruleSets = mfs.loadJSONDir(rulePath, list);
  const orderedRules = [];
  Object.values(ruleSets).forEach((ruleSet) => {
    Object.values(ruleSet).forEach((rule) => {
      orderedRules.push(rule);
    });
  });

  orderedRules.sort((a, b) => a.batchOrder - b.batchOrder);
  console.log(orderedRules);

  // Normalize the document for parsing.
  document.contractions().expand();
  tagHyphenatedTerms();
  compromiseInfinitivesToSyntaxFiniteVerbs();
  assignValues(orderedRules);
  document.lists().tag('List');
  tagParentheses();
  tagQuotations();
  tagDashGroups();
  tagPunctuation();
}
