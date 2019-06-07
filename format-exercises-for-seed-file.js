'use strict';
const readline = require('readline');
const fs = require('fs');

const readInterface = readline.createInterface({  
  //update whatever file name it is
  input: fs.createReadStream('./data.csv'),
  output: process.stdout,
  console: false
});

readInterface.on('line', function(line) {
  const lines = line.split(',');
  const vid = lines.pop();
  const title = lines.shift();
  const movement = lines.shift();

  const tags = lines.map(value => {
    let temp = value.replace('"', '').trim();
    return `'${temp}'`;
  });
  const newLine = `('${title}', '${movement}', ARRAY [${tags}], '${vid}'),\n`;
  
  //update to whatever output file you have
  fs.appendFileSync('./foo.txt', newLine);
});