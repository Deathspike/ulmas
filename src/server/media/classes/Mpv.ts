import * as app from '../..';
import childProcess from 'child_process';

export class Mpv {
  private position = 0;
  private total = 0;

  async openAsync(media: app.api.models.MediaRequest) {
    const args = ['--fs', '--hwdec=auto']
      .concat(media.videoUrl)
      .concat(`--start=${media.position}`)
      .concat(media.subtitleUrls.map(x => `--sub-file=${x}`));
    await new Promise((resolve, reject) => {
      const process = childProcess.spawn('mpv', args);
      process.stderr.on('data', this.onData.bind(this));
      process.on('error', reject);
      process.on('exit', resolve);
    });
    return new app.api.models.MediaStatus({
      position: this.position,
      total: this.total
    });
  }

  private onData(chunk: Buffer) {
    const match = String(chunk).match(/AV: (\d{2}):(\d{2}):(\d{2}) \/ (\d{2}):(\d{2}):(\d{2})/);
    if (!match) return;
    this.position = Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
    this.total = Number(match[4]) * 3600 + Number(match[5]) * 60 + Number(match[6]);
  }
}
