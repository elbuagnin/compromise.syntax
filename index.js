import "./local-config.js";
import initialize from "./initialize.js";
import sequence from "./rules/sequencial-parser/sequence-main.js";

const syntax = {
  api: View => {
    View.prototype.syntax = function() {
      initialize(this);
      sequence(this);
    };
  }
};

export default syntax;
