const fs = require('fs');
const readline = require('node:readline');
const process = require('node:process');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(file);
const rl = readline.createInterface(process.stdin);

console.log('***Hello. You can write some text.***');
rl.on('line', input => {
  if (input === 'exit') {
    console.log('***Thanks for your work!!!***');
    rl.close();
    return;
  }
  output.write(input + '\n');
  
});
process.on('SIGINT', () => {
  console.log('***Thanks for your work!!!***');
  rl.close();
});
