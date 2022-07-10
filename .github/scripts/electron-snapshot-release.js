const fs = require('fs');
const path = require('path');
const packagePath = path.resolve(__dirname, '../../package.json');

module.exports = async () => {
  const packageFile = await fs.promises.readFile(packagePath, 'utf-8');
  const packageData = JSON.parse(packageFile);
  packageData.version += '-snapshot';
  await fs.promises.writeFile(packagePath, JSON.stringify(packageData, null, 2));
};
