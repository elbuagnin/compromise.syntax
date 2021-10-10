import nlp from 'compromise';

nlp.extend((Doc, world) => {
  Doc.prototype.addCustomTags = function (tagData) { // eslint-disable-line
    const obj = {};
    Object.keys(tagData).forEach((k) => {
      const tag = tagData[k];
      obj[k] = tag;
    });

    world.addTags(obj);
  };

  Doc.prototype.addCustomWords = function (wordData) { // eslint-disable-line
    const obj = {};
    Object.keys(wordData).forEach((k) => {
      const word = wordData[k];
      obj[k] = word;
    });

    world.addWords(obj);
  };

  // Generates unique IDs for by Tag.
  const tagIDs = {};
  function* generateID(tag) {
    if (tag in tagIDs) {
      tagIDs[tag]++;
    } else {
      tagIDs[tag] = 0;
    }

    yield tag + tagIDs[tag];
  }

    Doc.prototype.syntaxTag = function (item, tag) { // eslint-disable-line
    if (!item) return;
    console.log(item);

    // Tag with syntax tag and unique id.
    const id = generateID(tag).next().value;

    // Tag original sentence.
    this.match(item).tag(tag);
    this.match(item).tag(id);
  };
});
