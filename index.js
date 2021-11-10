import './local-config.js';
import initialize from './initialize.js';
import parser from './parser.js';

export default function syntax(Doc, world) { // eslint-disable-line
  Doc.prototype.syntax =  function () {  // eslint-disable-line
    const document = this;
    console.log('\n\n');
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log('Document before processing:');
    console.log(document.debug());

    initialize(document);
    parser(document);
    console.log('############################################################');
    console.log('Document after processing:');
    console.log(document.debug());
  };
}
