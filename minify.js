const { execSync } = require('child_process');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

function minifyFile(filePath) {
  const outputFilePath = filePath.replace(/\.js$/, '.min.js');
  const command = `terser "${filePath}" --compress --mangle -o "${outputFilePath}"`;
  execSync(command, { stdio: 'inherit' });
}

function minifyDirectory(directoryPath) {
  const files = readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = join(directoryPath, file);
    if (statSync(filePath).isDirectory()) {
      minifyDirectory(filePath);
    } else if (file.endsWith('.js')) {
      minifyFile(filePath);
    }
  });
}

minifyDirectory('dist');
