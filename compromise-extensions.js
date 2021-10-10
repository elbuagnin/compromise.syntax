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
});
