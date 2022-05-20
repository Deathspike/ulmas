import os from 'os';
import path from 'path';
const packageData = require('../../package');

const app = {
  description: String(packageData.description),
  name: String(packageData.name),
  version: String(packageData.version)
};

const paths = {
  cache: path.join(os.homedir(), packageData.name, packageData.version),
  sections: path.join(os.homedir(), packageData.name, 'sections.xml')
};

export const settings = {app, paths};
