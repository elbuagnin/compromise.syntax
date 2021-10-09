'use strict';
import nlp from 'compromise';
import readline from 'readline';

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question('Enter some text for NLP to parse:', (text) => {

    nlp(text).debug();

    rl.close();
});
