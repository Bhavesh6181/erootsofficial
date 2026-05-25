const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const candidateEnvFiles = [
  path.resolve(__dirname, '..', '..', '.env'),
  path.resolve(__dirname, '..', '..', '.env.local'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', '.env.local'),
];

const loadedEnvFiles = [];

for (const envFile of candidateEnvFiles) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile, override: false });
    loadedEnvFiles.push(envFile);
  }
}

module.exports = {
  loadedEnvFiles,
};
