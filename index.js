import "./local-config.js";
import initialize from "./initialize.js";
import parser from "./parser.js";

export const syntaxPlugin = {
  api: View => {
    View.prototype.syntax = function() {
      initialize(this);
      parser(this);
      return this;
    };
  }
};
