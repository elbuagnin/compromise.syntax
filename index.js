import "./local-config.js";
import initialize from "./initialize.js";
import parser from "./parser.js";

const syntax = {
  api: View => {
    View.prototype.syntax = function() {
      initialize(this);
      parser(this);
    };
  }
};

export default syntax;
