const path = require('path');
const { readdir, mkdir, copyFile, rm, writeFile, readFile } = require('node:fs/promises');
const dir = path.join(__dirname, 'assets');
const cpDir = path.join(__dirname, 'project-dist');

async function copyDir(from, tu) {
  try {
    await mkdir(tu, { recursive: true });
    const files = await readdir(from, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        copyDir(path.join(from, file.name), path.join(tu, file.name));
        continue;
      }
      await copyFile(path.join(from, file.name), path.join(tu, file.name));
    }
  } catch (error) {
    console.error(error);
  }
}

async function packFileCss(from, tu) {
  const cssArr = [];
  const files = await readdir(from, { withFileTypes: true });
  for (const file of files) {
    if (!file.isFile() || path.extname(path.join(from, file.name)) !== '.css') continue;
    cssArr.push(readFile(path.join(from, file.name)));
  }
  Promise.all(cssArr)
    .then(data => {
      writeFile(tu, data.join('\n'));
    })
    .catch((err) => console.error(err));
}

async function creatHTML(from, tu, components) {
  const cmp = {};
  let template = await readFile(from, { encoding: 'utf-8' });
  const files = await readdir(components, { withFileTypes: true });
  const tegsArr = template.match(/{{\w+}}/g);
  for (const file of files) {
    if (!file.isFile() || path.extname(path.join(components, file.name)) !== '.html') continue;
    cmp[`{{${file.name.split('.')[0]}}}`] = readFile(path.join(components, file.name), { encoding: 'utf-8' });
  }
  for (let i = 0; i < tegsArr.length; i++) {
    if (!cmp[tegsArr[i]]) {
      template = template.replace(new RegExp(tegsArr[i]), '');
      console.error(`component ${tegsArr[i]} not found`);   
      continue;
    } 
    const replasement = await cmp[tegsArr[i]];
    template = template.replace(new RegExp(tegsArr[i]), replasement);   
  }
  writeFile(tu, template);
}

(async function rmmkDir(removeDir) {
  const files = await readdir(__dirname, { withFileTypes: true });
  for (const file of files) {
    if (file.name === 'project-dist' && file.isDirectory()) {
      await rm(removeDir, { recursive: true, force: true });
      break;
    }
  }
  await mkdir(removeDir, { recursive: true });
  copyDir(dir, path.join(cpDir, 'assets')).catch(console.error);
  packFileCss(path.join(__dirname, 'styles'), path.join(cpDir, 'style.css')).catch(console.error);
  creatHTML(path.join(__dirname, 'template.html'), path.join(cpDir, 'index.html'), path.join(__dirname, 'components')).catch(console.error);
})(cpDir).catch(console.error);
