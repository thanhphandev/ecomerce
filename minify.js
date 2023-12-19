const { execSync } = require('child_process');
const { readdirSync, statSync, existsSync, unlinkSync } = require('fs');
const { join } = require('path');

function minifyFile(filePath) {
  const outputFilePath = filePath.replace(/\.js$/, '.min.js');

  // Kiểm tra xem file .min.js đã tồn tại hay chưa
  if (existsSync(outputFilePath)) {
    // Nếu tồn tại, xóa nó đi
    unlinkSync(outputFilePath);
  }

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
