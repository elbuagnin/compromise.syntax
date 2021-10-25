import './compromise-extensions.js';
import preParser from './pre-parser.js';
import * as mfs from './lib/filesystem.js';

function verbVerbalCorrecter(doc) {
  // This function is needed to correct an issue with the custom Tags.
  // Verbals are not verbs. Infinitives are verbals.
  // Compromise tags many Base Verbs as Infinitives.
  // Sometimes, the custom Tags will confuse Compromise's internal tagging.
  // When this happens, some Verbal/Verbs get wiped of all tags.
  // This little routine finds them and adds a BaseVerb tag to them.

  const emptyTag = doc.not('(#Noun|#Verb|#Value|#Date|#Adjective|#Contraction|#Adverb|#Currency|#Determiner|#Conjunction|#Preposition|#QuestionWord|#Pronoun|#Expression|#Abbreviation|#Url|#HashTag|#PhoneNumber|#AtMention|#Emoji|#Emoticon|#Email|#Auxiliary|#Negative|#Acronym|#Verbal)');

  if (emptyTag.found) {
    console.log('Here is a tagless word:');
    console.log(JSON.stringify(emptyTag));

    emptyTag.tag('#BaseVerb');
  }
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

  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log('$$ Pre-Parser');

  preParser(doc);
}
