import * as nst from '@nestjs/common';
import fs from 'fs';

@nst.Injectable()
export class Service {
  async imageAsync(imagePath: string) {
    const extensions = ['.gif', '.jpg', '.png', '.webp'];
    const filePaths = await fileAsync(imagePath, extensions);
    return filePaths.find(Boolean);
  }

  async videoAsync(videoPath: string) {
    const extensions = ['.avi', '.mp4', '.mkv', '.ogm', '.webm'];
    const filePaths = await fileAsync(videoPath, extensions);
    return filePaths.find(Boolean);
  }
}

async function fileAsync(itemPath: string, extensions: Array<string>) {
  return await Promise.all(extensions.map(async (extension) => {
    const filePath = itemPath + extension;
    const stat = await fs.promises.stat(filePath).catch(() => undefined);
    return stat && filePath;
  }));
}
