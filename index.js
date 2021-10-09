import './local-config.js';
import nlp from 'compromise';
import parser from './parser.js';


   nlp.extend((Doc, world) => { // eslint-disable-line

     Doc.prototype.syntax = function syntax() {  // eslint-disable-line
      const document = this;
      parser(document);
    };
  });
