import parseGroupings from "./groupings.js";
import parsePunctuatedPhrasing from "./punctuated-and-conjunction-phrasing.js";

export default function sequence(doc) {
    parseGroupings(doc);
    parsePunctuatedPhrasing(doc);

    doc.debug();
}
