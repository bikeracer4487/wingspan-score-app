#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appJsonPath = path.join(__dirname, '..', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

const currentVersion = appJson.expo.version;
const versionParts = currentVersion.split('.');

const bumpType = process.argv[2] || 'patch';

switch (bumpType) {
  case 'major':
    versionParts[0] = String(parseInt(versionParts[0]) + 1);
    versionParts[1] = '0';
    versionParts[2] = '0';
    break;
  case 'minor':
    versionParts[1] = String(parseInt(versionParts[1]) + 1);
    versionParts[2] = '0';
    break;
  case 'patch':
  default:
    versionParts[2] = String(parseInt(versionParts[2]) + 1);
    break;
}

const newVersion = versionParts.join('.');
appJson.expo.version = newVersion;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

console.log(`Version bumped from ${currentVersion} to ${newVersion}`);

// Create git commit
try {
  execSync('git add app.json', { stdio: 'inherit' });
  execSync(`git commit -m "Bump version to ${newVersion}"`, { stdio: 'inherit' });
  console.log(`✅ Created commit for version ${newVersion}`);
} catch (error) {
  console.error('❌ Failed to create git commit:', error.message);
  console.log('You can manually commit with: git add app.json && git commit -m "Bump version to ' + newVersion + '"');
}