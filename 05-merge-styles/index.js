const path = require('path');
const fs = require('fs');
const { readdir, open, mkdir, copyFile, rm } = require('node:fs/promises');
const dir = path.join(__dirname, 'styles');
const cpDir = path.join(__dirname, 'files-copy');

async function packFileCss(dir) {
  const cssArr = [];
  const files = await readdir(dir, { withFileTypes: true });
  readFile(0, files);
  
  
  //console.log(files.length);
/*   for (const file of files) {
    if (!file.isFile() || path.extname(`${dir}/${file.name}`) !== '.css') continue;
    //const fr = await open(`${dir}/${file.name}`);
    const read = fs.createReadStream(`${dir}/${file.name}`);
    //const fw = await open(`${dir}/${file.name}`);
    const write = fs.createWriteStream(`${dir}/bundle.css`);

    let data = '';
    read.on('data', chunc => {
      data += chunc;
      write.write(chunc);
      //console.log(data);
    });
    console.log('date 1', new Date);
    read.on('end', () => {
      cssArr.push(data);
      console.log('date 2', new Date);
    });
  }
  console.log('date 3', new Date);
  */
}
packFileCss(dir);

function readFile(index, list) {
  if (!list[index].isFile() || path.extname(`${dir}/${list[index].name}`) !== '.css') {
    if (index < list.length - 1) readFile(index + 1, list);
    return;
  }
  
  const read = fs.createReadStream(`${dir}/${list[index].name}`);
  const write = fs.createWriteStream(`${__dirname}/project-dist/bundle.css`, {flags: 'r+'});
  read.on('data', chunc => {

    //data += chunc;
    write.write(chunc);
    console.log('date 1', index);
  });
  read.on('end', () => {
    if (index < list.length - 1) readFile(index + 1, list);
    
    //cssArr.push(data);
    //console.log('date 2', new Date);
  });
}
