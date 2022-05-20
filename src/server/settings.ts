import os from 'os';
import path from 'path';
const packageData = require('../../package');

export const settings = {
  cache: path.join(os.homedir(), packageData.name, packageData.version),
  sections: path.join(os.homedir(), packageData.name, 'sections.json')
};
