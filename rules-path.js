import path from "path";
import { fileURLToPath } from "url";

const here = fileURLToPath(new URL(".", import.meta.url));
const rulesDir = path.join(here, "./rules/");

const periodicParserDir = path.join(rulesDir, "periodic-parser/");
const sequencialParserDir = path.join(rulesDir, "sequencial-parser/");

const initializeDir = path.join(rulesDir, "initialize/");
const tagDir = path.join(initializeDir, "tags/");
const wordDir = path.join(initializeDir, "words/");

export { tagDir, wordDir, periodicParserDir, sequencialParserDir};
