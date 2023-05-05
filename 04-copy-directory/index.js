const path = require('path');
const { readdir, mkdir, copyFile, rm } = require('node:fs/promises');
const dir = path.join(__dirname, 'files');
const cpDir = path.join(__dirname, 'files-copy');

(async function rmDir(removeDir) {
  const files = await readdir(__dirname, { withFileTypes: true });
  for (const file of files) {
    if (file.name === 'files-copy' && file.isDirectory()) {
      await rm(removeDir, { recursive: true, force: true });
      break;
    }
  }
  copyDir(dir, cpDir);
})(cpDir);

async function copyDir(from, tu) {
  try {
    await mkdir(tu, { recursive: true });
    const files = await readdir(from, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        copyDir(`${from}/${file.name}`, `${tu}/${file.name}`);
        continue;
      }
      await copyFile(`${from}/${file.name}`, `${tu}/${file.name}`);
    }
  } catch (error) {
    console.error(error);
  }
}

