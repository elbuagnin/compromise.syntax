import './compromise-extensions.js';
import preParser from './pre-parser.js';
import * as mfs from './lib/filesystem.js';

function verbVerbalCorrecter(doc) {
  // This module uses custom tags that run counter to some of Compromise's tags.
  // As such, some custom tags can confuse Compromise's internal tagger.
  // This subroutine fixes these tags after the custom tags are applied.

  // Untagged Verbs
  const emptyTag = doc.not('(#Noun|#Verb|#Value|#Date|#Adjective|#Contraction|#Adverb|#Currency|#Determiner|#Conjunction|#Preposition|#QuestionWord|#Pronoun|#Expression|#Abbreviation|#Url|#HashTag|#PhoneNumber|#AtMention|#Emoji|#Emoticon|#Email|#Auxiliary|#Negative|#Acronym|#Verbal)');

  if (emptyTag.found) {
    console.log('Here is a tagless word:');
    console.log(JSON.stringify(emptyTag));

    emptyTag.tag(['#BaseVerb', 'PresentTense']);
  }

  // Gerunds turned into Auxiliary Verbs, but need to be Verbals
  const gerunds = doc.match('(#Auxiliary && #Verb && /ing$/)');
  gerunds.tag('#Verbal');
}

export default function initialize(doc) {
  const baseDir = './rules/initialize/';
  const tagDir = `${baseDir}tags/`;
  const wordDir = `${baseDir}words/`;

  const tags = mfs.loadJSONDir(tagDir, 'tags');
  const words = mfs.loadJSONDir(wordDir, 'words');

  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log('$$ Initialization');
  doc.addCustomTags(tags);
  doc.addCustomWords(words);
  verbVerbalCorrecter(doc);

  console.log('Doc, post-Initialization');
  console.log(doc.debug());

  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log('$$ Pre-Parser');

  preParser(doc);
}
