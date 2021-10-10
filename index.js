import './local-config.js';
import initialize from './initialize.js';
import parser from './parser.js';

export default async function syntax(Doc, world) { // eslint-disable-line
  Doc.prototype.syntax = async function () {  // eslint-disable-line
    const document = this;
    await initialize()
      .then(parser(document));
  };
}
