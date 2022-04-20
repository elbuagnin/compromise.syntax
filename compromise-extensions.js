import nlp from "compromise";

nlp.plugin({
  api: View => {
    (View.prototype.fix = function() {
      // eslint-disable-line
      const expandedContractions = this;
      if (expandedContractions.found) {
        const initialTags = nlp(expandedContractions.text()).out("tags");
        const expandedTags = expandedContractions.out("tags");

        if (initialTags !== expandedTags) {
          const words = expandedContractions.text().split(" ");

          words.forEach(word => {
            const tags = initialTags[0][word];
            expandedContractions.match(word).tag(tags);
          });
        }
      }
    }),
      (View.prototype.addCustomTags = function(tagData) {
        const obj = {};
        Object.keys(tagData).forEach(k => {
          const tag = tagData[k];
          obj[k] = tag;
        });

        nlp.plugin({
          tags: obj
        });
      }),
      (View.prototype.addCustomWords = function(wordData) {
        const obj = {};
        Object.keys(wordData).forEach(k => {
          const word = wordData[k];
          obj[k] = word;
        });

        nlp.plugin({
          words: obj
        });
      }),
      (View.prototype.previous = function() {
        // eslint-disable-line
        const precedingWords = this.all().before(this);
        const precedingWord = precedingWords.lastTerms();

        if (precedingWord.found) {
          return precedingWord;
        }
        return this.match(nothing);
      }),
      (View.prototype.next = function() {
        // eslint-disable-line
        const succeedingWords = this.all().after(this);
        const succeedingWord = succeedingWords.firstTerms();

        if (succeedingWord.found) {
          return succeedingWord;
        }
        return this.match(nothing);
      });
  }
});
