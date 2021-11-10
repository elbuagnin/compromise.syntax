import './compromise-extensions.js';
import preParser from './pre-parser.js';
import * as mfs from './lib/filesystem.js';

function preTagCorrecter(doc) {
  // Adverbs mixed with Verbs are marked Auxiliary which interferes with Verbal tags.
  const adverbs = doc.match('(#Auxiliary && #Adverb)');
  console.log(`AAAAAAAAAAAAAAAAAAAA ${JSON.stringify(adverbs.tags())}`);

  adverbs.untag('#Auxiliary');
  console.log(`AAAAAAAAAAAAAAAAAAAA${JSON.stringify(adverbs.tags())}`);
}

function postTagCorrecter(doc) {
  // This module uses custom tags that run counter to some of Compromise's tags.
  // As such, some custom tags can confuse Compromise's internal tagger.
  // This subroutine fixes these tags after the custom tags are applied.

  // Untagged Verbs
  const emptyTag = doc.not('(#Noun|#Verb|#Value|#Date|#Adjective|#Contraction|#Adverb|#Currency|#Determiner|#Conjunction|#Preposition|#Possessive|#QuestionWord|#Pronoun|#Expression|#Abbreviation|#Url|#HashTag|#PhoneNumber|#AtMention|#Emoji|#Emoticon|#Email|#Auxiliary|#Negative|#Acronym|#Verbal)');

  emptyTag.tag(['#BaseVerb', 'PresentTense']);

  // Verbs with no tense
  const noTenseVerbs = doc.match('(#Verb && !#PresentTense && !#Infinitive && !#Gerund && !#PastTense && !#PerfectTense && !#FuturePerfect && !#Pluperfect && !#Copula && !#Modal && !#Participle && !#Particle && !#PhrasalVerb)');

  noTenseVerbs.tag('#PresentTense');

  // Gerunds turned into Auxiliary Verbs, but need to be Verbals
  const gerunds = doc.match('(#Auxiliary && #Verb && /ing$/)');

  gerunds.tag(['#ProgressiveVerbal', '#Verbal']);
}

export default function initialize(doc) {
  const baseDir = './rules/initialize/';
  const tagDir = `${baseDir}tags/`;
  const wordDir = `${baseDir}words/`;

  const tags = mfs.loadJSONDir(tagDir, 'tags');
  const words = mfs.loadJSONDir(wordDir, 'words');

  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log('$$ Initialization');
  preTagCorrecter(doc);
  doc.addCustomTags(tags);
  doc.addCustomWords(words);
  postTagCorrecter(doc);

  console.log('Doc, post-Initialization');
  console.log(doc.debug());

  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log('$$ Pre-Parser');

  preParser(doc);
}
