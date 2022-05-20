import fs from 'fs';

export class Context {
  readonly directories: Record<string, fs.Stats & {fullPath: string}> = {};
  readonly images: Record<string, fs.Stats & {fullPath: string}> = {};
  readonly info: Record<string, fs.Stats & {fullPath: string}> = {};
  readonly subtitles: Record<string, fs.Stats & {fullPath: string}> = {};
  readonly videos: Record<string, fs.Stats & {fullPath: string}> = {};
}
