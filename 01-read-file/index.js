const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, 'text.txt');
const read = fs.createReadStream(dir, 'utf-8');
let data = '';
read.on('data', chunc => data += chunc);
read.on('end', () => console.log(data));

