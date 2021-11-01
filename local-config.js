/* eslint-disable no-undef */
export const terminal = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  // Foreground (text) colors
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m',
  },
  // Background colors
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

global.startMarker = function () {
  console.log(`${terminal.bg.red}                                                         ${terminal.reset}`);
};

global.display = function (v, name = '', devInfoOn = false) {
  if (devInfoOn) {
    console.log(`\n${terminal.bright}`);
    if (name) {
      console.log(`${name}: `);
    }
    console.log(terminal.fg.magenta + String(v));
    console.log(terminal.reset);
  }
};

global.devBlock = function (name, devInfoOn = false) {
  if (devInfoOn) {
    console.log('\n');
    console.log(`${terminal.bg.magenta + terminal.fg.white}Function Call:                                           ${terminal.reset}`);
    console.log(terminal.bright + name + terminal.reset);
  }
};

global.devInfo = function (v, name = 'unknown', devInfoOn = false, devBlockName = '') { // eslint-disable-line
  if (devInfoOn === true) {
    console.log('\n');
    console.log(`${terminal.bg.blue + terminal.fg.white}Info on Variable:                                        ${terminal.reset}`);

    console.log(`${terminal.fg.blue + terminal.bright}Name: ${terminal.reset}${terminal.bright}${name}${terminal.reset}`);
    if (v) {
      console.log(`${terminal.fg.blue}Type: ${terminal.reset}${typeof v}`);
      console.log(`${terminal.fg.blue}Object Constructor: ${terminal.reset}${v.constructor.name}`);
      console.log(`${terminal.fg.blue}Contents: ${terminal.reset}${JSON.stringify(v)}`);

      switch (v.constructor.name) {
        case 'sentence':
          v.text();
          v.debug();
          break;
        case 'So':
          v.text();
          v.debug();
          break;
        case 't':
          v.text();
          v.debug();
          break;
        case 'r':
          v.text();
          v.debug();
          break;
        default:
          break;
      }
    } else {
      console.log('Undefined');
    }
    console.log(`${terminal.bg.cyan + terminal.fg.white}---------------------------------------------------------${terminal.reset}`);
  }
};
/* eslint-enable no-undef */
