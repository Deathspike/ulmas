import childProcess from 'child_process';
import treeKill from 'tree-kill';

export class Mpv {
  private position = 0;
  private total = 0;

  async openAsync(
    signal: AbortSignal,
    start: number,
    subtitleUrls: Array<string>,
    videoUrl: string
  ) {
    const args = ['--fs', '--hwdec=auto']
      .concat(videoUrl)
      .concat(`--start=${start}`)
      .concat(subtitleUrls.map(x => `--sub-file=${x}`));
    await this.runAsync(signal, args);
    return {position: this.position, total: this.total};
  }

  private onData(chunk: Buffer) {
    const expression = /AV: (\d{2}):(\d{2}):(\d{2}) \/ (\d{2}):(\d{2}):(\d{2})/;
    const match = String(chunk).match(expression);
    if (!match) return;
    this.position =
      Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
    this.total =
      Number(match[4]) * 3600 + Number(match[5]) * 60 + Number(match[6]);
  }

  private async runAsync(signal: AbortSignal, args: Array<string>) {
    return await new Promise((resolve, reject) => {
      const process = childProcess.spawn('mpv', args);
      process.stderr.on('data', x => this.onData(x));
      process.on('error', reject);
      process.on('exit', resolve);
      signal.addEventListener('abort', () => {
        if (!process.pid) return;
        treeKill(process.pid);
      });
    });
  }
}
