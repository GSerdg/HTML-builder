const path = require('path');
const {readdir, stat} = require('node:fs/promises');
const dir = path.join(__dirname, 'secret-folder');

(async function(dir) {
  try {
    const files = await readdir(dir, {withFileTypes: true});    
    for (const file of files) {
      if (!file.isFile()) continue;
      const filename = file.name.split('.')[0];
      const extname = path.extname(path.join(dir, file.name)).split('.')[1];
      const filesize = (await stat(path.join(dir, file.name))).size.toString();  
      console.log(`${filename} - ${extname} - ${filesize}b`);
    }
  } catch (error) {
    console.error(error);
  }

})(dir);
