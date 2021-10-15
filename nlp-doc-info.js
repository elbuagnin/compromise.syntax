import nlp from 'compromise';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function recursiveAsyncReadLine() {
  rl.question('Enter some text for NLP to parse: ', (text) => {
    if (text === 'exit') { return rl.close(); } // Got to break free
    nlp(text).debug();
    recursiveAsyncReadLine(); // rinse, repeat
    return true;
  });
}

recursiveAsyncReadLine();
