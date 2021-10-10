import './local-config.js';
import initialize from './initialize.js';
// import parser from './parser.js';

export default function syntax(Doc, world) { // eslint-disable-line
  Doc.prototype.syntax =  function () {  // eslint-disable-line
    const document = this;
    initialize(document);
    // parser(document);
    document.debug();
  };
}
