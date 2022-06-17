import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';

class BinaryWriter {
  constructor(
    private readonly stream: NodeJS.WritableStream) {}
  
  writeByte(value: number) {
    if (value < 0 || value > 255) throw new Error();
    var ar = new Uint8Array(1);
    ar[0] = value;
    this.stream.write(ar);
  }

  writeLeb128(value: number) {
    if (value < 0 || value > 4294967295)
      throw new Error();
    while (value > 0x7F) {
      this.writeByte((value | 0x80) & 0xFF);
      value >>>= 7;
    }
    this.writeByte(value);
  }
  writeString(value?: string) {
    if (!value) {
      this.writeLeb128(0);
    } else {
      const buffer = Buffer.from(value, 'utf-8');
      this.writeLeb128(buffer.byteLength);
      this.stream.write(buffer);
    }
  }
}

export class SectionCache {
  constructor(sectionId: string) {
    this.fullPath = path.join(app.settings.cache, `series.${sectionId}.json`);
  }

  async loadAsync() {
    const sectionJson = await fs.promises.readFile(this.fullPath, 'utf-8');
    const sectionRoot: Array<app.api.models.SeriesEntry> = JSON.parse(sectionJson);
    const section = sectionRoot.map(x => new app.api.models.SeriesEntry(x));
    await Promise.all(section.map(x => clv.validateOrReject(x)));
    return section;
  }

  async saveAsync(section: Array<app.api.models.SeriesEntry>) {
    await Promise.all(section.map(x => clv.validateOrReject(x)));
    await fs.promises.mkdir(path.dirname(this.fullPath), {recursive: true});
    await fs.promises.writeFile(`${this.fullPath}.tmp`, JSON.stringify(section));
    await fs.promises.rename(`${this.fullPath}.tmp`, this.fullPath);
  }

  async writeExperimentAsync(section: Array<app.api.models.SeriesEntry>) {
    const writeStream = fs.createWriteStream(`${this.fullPath}.packed`);
    const binaryWriter = new BinaryWriter(writeStream);

    binaryWriter.writeLeb128(section.length);
    for (const series of section) {
      binaryWriter.writeString(series.id);
      binaryWriter.writeLeb128(series.images?.length ?? 0);
      for (const image of series.images ?? []) {
        binaryWriter.writeString(image.id);
        binaryWriter.writeString(image.name);
      }
      binaryWriter.writeString(series.dateEpisodeAdded);
      binaryWriter.writeString(series.lastPlayed);
      binaryWriter.writeLeb128(series.totalCount ?? 0);
      binaryWriter.writeLeb128(series.unwatchedCount ?? 0);
      binaryWriter.writeString(series.title);
      binaryWriter.writeString(series.dateAdded);
    }

    writeStream.end();
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
