import * as app from '../..';
import * as clv from 'class-validator';
import fs from 'fs';
import path from 'path';
import {DateTime} from 'luxon';
import zlib from 'zlib';

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

  writeDateStringAsUInt32(value?: string) {
    const seconds = value
      ? DateTime.fromISO(value).toSeconds()
      : 0;
    if (seconds < 0 || seconds > 4294967295)
      throw new Error();
    this.writeLeb128(seconds);
    /*const ab = new ArrayBuffer(4);
    const db = new DataView(ab);
    db.setUint32(0, seconds);
    this.stream.write(new Uint8Array(ab));*/
  }

  writeIdAsBuffer(value: string) {
    const buffer = Buffer.from(value, 'base64url');
    this.writeLeb128(buffer.byteLength);
    this.stream.write(buffer);
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
    const brotli = zlib.createBrotliCompress();
    brotli.on('error', function(err){    console.log(err.stack);   });

    const f = fs.createWriteStream(`${this.fullPath}.packed.br`);
    f.on('error', function(err){    console.log(err.stack);       });
    f.on('finish', function() {    console.log("Write success.");   });
    
    brotli.pipe(f);

    const binaryWriter = new BinaryWriter(brotli);
    binaryWriter.writeLeb128(section.length);
    for (const series of section) {
      binaryWriter.writeIdAsBuffer(series.id);
      binaryWriter.writeLeb128(series.images?.length ?? 0);
      for (const image of series.images ?? []) {
        binaryWriter.writeIdAsBuffer(image.id);
        binaryWriter.writeString(image.name);
      }
      binaryWriter.writeDateStringAsUInt32(series.dateEpisodeAdded);
      binaryWriter.writeDateStringAsUInt32(series.lastPlayed);
      binaryWriter.writeLeb128(series.totalCount ?? 0);
      binaryWriter.writeLeb128(series.unwatchedCount ?? 0);
      binaryWriter.writeString(series.title);
      binaryWriter.writeDateStringAsUInt32(series.dateAdded);
    }

    brotli.flush();
    brotli.end();
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  readonly fullPath: string;
}
