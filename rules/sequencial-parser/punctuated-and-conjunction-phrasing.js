// Punctuated and Conjunction Phrasing
// 3rd Parsing

export default function parsePunctuatedPhrasing(doc) {
    // Tag adjectives with no comma for later.
    doc.match("(#Adjective && !#Comma)")
        .tag("#NoCommaAdjective");

    // Compound Adjectives
    doc.match("#NoCommaAdjective #CoordinatingConjunction #Adjective")
        .tag([
            "CompoundPhrase",
            "CompoundAdjectives",
            "Adjectival"
        ]);

    // Coordinating Adjectives
    doc.match("#Adjective #CommaAdjective+ #NoCommaAdjective")
        .tag([
            "CoordinatingAdjectives",
            "Adjectival"
        ]);

    // Coordinating Adjectives with Coordinating Conjunction joining last term
    doc.match("#Adjective #CommaAdjective+ (and|but) #NoCommaAdjective")
        .tag([
            "CoordinatingAdjectives",
            "Adjectival"
        ]);

    // Remaining Adjective groups as Cumulative
    doc.match("(#Adjective && !#CoordinatingAdjectives && !#CumulativeAdjectives")
        .tag("#UnassignedAdjectives");

    doc.match("#UnassignedAdjectives{2,}")
        .tag([
            "CumulativeAdjectives",
            "Adjectival"
        ]);

    // Clean up on Adjective tagging.
    doc.match("#NoCommaAdjective")
        .unTag("#NoCommaAdjective");

    doc.match("#UnassignedAdjectives")
        .unTag("#UnassignedAdjectives");
}
//     "Noun Lists 1": {
//         "batch": "Punctuated and Conjunction Phrasing",
//         "batchOrder": "3",
//         "order": "9",
//         "type": "inter-phrase",
//         "pattern": "#CommaNoun+ #CoordinatingConjunction #Noun+",
//         "tag": {
//             "all": [
//                 "List",
//                 "Nominal"
//             ]
//         }
//     },
//     "Noun Lists 2": {
//         "batch": "Punctuated and Conjunction Phrasing",
//         "batchOrder": "3",
//         "order": "10",
//         "type": "inter-phrase",
//         "pattern": "(#Adjective?+ #CommaNoun+)+ #CoordinatingConjunction #Adjective?+ #Noun+",
//         "tag": {
//             "all": [
//                 "List",
//                 "Nominal"
//             ]
//         },
//         "untag": {
//             "on": {
//                 "term": "#Adjectival",
//                 "termUnTag": "#Adjectival"
//             }
//         }
//     },
//     "Compound Noun Phrases 1": {
//         "batch": "Punctuated and Conjunction Phrasing",
//         "batchOrder": "3",
//         "order": "11",
//         "type": "intra-phrase",
//         "pattern": "(#Noun+ && !#List && !#Comma) #CoordinatingConjunction #Noun+",
//         "tag": {
//             "all": [
//                 "CompoundPhrase",
//                 "CompoundNouns",
//                 "Nominal"
//             ]
//         },
//         "untag": {
//             "on": {
//                 "term": "#Adjectival",
//                 "termUnTag": "#Adjectival"
//             }
//         }
//     },
//     "Compound Noun Phrases 2": {
//         "batch": "Punctuated and Conjunction Phrasing",
//         "batchOrder": "3",
//         "order": "12",
//         "type": "intra-phrase",
//         "pattern": "#Adjective?+ (#Noun+ && !#List && !#Comma) #CoordinatingConjunction #Adjective?+ #Noun+",
//         "tag": {
//             "all": [
//                 "CompoundPhrase",
//                 "CompoundNouns",
//                 "Nominal"
//             ]
//         },
//         "untag": {
//             "on": {
//                 "term": "#Adjectival",
//                 "termUnTag": "#Adjectival"
//             }
//         }
//     },
//     "Compound Verb Phrases": {
//         "batch": "Punctuated and Conjunction Phrasing",
//         "batchOrder": "3",
//         "order": "13",
//         "type": "intra-phrase",
//         "pattern": "#Verb #CoordinatingConjunction #Verb",
//         "tag": {
//             "all": [
//                 "CompoundPhrase",
//                 "CompoundVerbs",
//                 "Verbs"
//             ]
//         }
//     },
//     "Compound Progressive Verbal Phrases": {
//         "batch": "Punctuated and Conjunction Phrasing",
//         "batchOrder": "3",
//         "order": "14",
//         "type": "intra-phrase",
//         "pattern": "#Adverb?+ #ProgressiveVerbal #CoordinatingConjunction #ProgressiveVerbal",
//         "tag": {
//             "all": [
//                 "CompoundPhrase",
//                 "CompoundVerbals",
//                 "VerbalPhrase"
//             ]
//         },
//         "untag": {
//             "on": {
//                 "term": "#Adverbial",
//                 "termUnTag": "#Adverbial"
//             }
//         }
//     }
// }