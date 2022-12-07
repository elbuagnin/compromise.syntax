// Groupings
// 2nd Parsing
// Prepatory tagging of groupings to help with later parsing

export default function parseGroupings(doc) {
  // Tag entire Negative Infinitive phrase
  doc.match("not to #Infinitive")
    .tag([
      "Infinitive",
      "Negative"
    ]);

  // Tag basic POS with commas
  doc.match("(#Noun && #Comma)")
    .tag("CommaNoun");

  doc.match("(#Hyphenated && #Noun)(#Noun && #Comma)")
    .tag("CommaNoun");

  doc.match("(#Adjective && #Comma)")
    .tag("CommaAdjective");

  doc.match("(#Adverb && #Comma)")
    .tag("CommaAdverb");

  // Find and tag Agents
  doc.match("(#Person|#Actor)")
    .tag("Agent");

  doc.match("(#Pronoun && !#RelativePronoun)")
    .tag("Agent");

  doc.match("(person|people)")
    .tag("Agent");

  doc.match("#ProperNoun{2,}")
    .tag([
      "Agent",
      "Nouns"
    ]);

  // Tag groupings of a POS
  doc.sentences().forEach(sentence => {
    sentence.match("#Noun{2,}").tag("Nouns");
  });

  doc.sentences().forEach(sentence => {
    sentence.match("#Adjective{2,}").tag("Adjectives");
  });

  doc.sentences().forEach(sentence => {
    sentence.match("#Adverb{2,}").tag("Adverbs");
  });

  doc.sentences().forEach(sentence => {
    sentence.match("#Verb{2,}").tag("Verbs");
  });
}

