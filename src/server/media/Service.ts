import * as nst from '@nestjs/common';
import fs from 'fs';
import path from 'path';

@nst.Injectable()
export class Service {
  async imageAsync(filePath: string) {
    const extensions = ['.gif', '.jpg', '.png', '.webp'];
    const imagePaths = await fileAsync(filePath, extensions);
    return imagePaths.find(Boolean);
  }

  async videoAsync(filePath: string) {
    const extensions = ['.avi', '.mp4', '.mkv', '.ogm', '.webm'];
    const videoPaths = await fileAsync(filePath, extensions);
    return videoPaths.find(Boolean);
  }
}

async function fileAsync(resourcePath: string, extensions: Array<string>) {
  const resource = path.parse(resourcePath);
  return await Promise.all(extensions.map(async (extension) => {
    const filePath = path.join(resource.dir, resource.name + extension);
    const invalid = await fs.promises.access(filePath).catch(() => true);
    return !invalid && filePath;
  }));
}
