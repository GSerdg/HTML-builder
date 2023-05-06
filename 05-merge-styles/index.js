const path = require('path');
const { readdir, readFile, writeFile } = require('node:fs/promises');
const dir = path.join(__dirname, 'styles');

(async function packFileCss(dir) {
  const cssArr = [];
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    if (!file.isFile() || path.extname(path.join(dir, file.name)) !== '.css') continue;
    cssArr.push(readFile(path.join(dir, file.name)));
  }
  Promise.all(cssArr)
    .then(data => {
      writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), data.join('\n'));
    })
    .catch(err => console.error(err));
})(dir);
