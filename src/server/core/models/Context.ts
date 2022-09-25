import fs from 'fs';

export class Context {
  readonly directories = new Map<string, fs.Stats & {fullPath: string}>();
  readonly images = new Map<string, fs.Stats & {fullPath: string}>();
  readonly info = new Map<string, fs.Stats & {fullPath: string}>();
  readonly subtitles = new Map<string, fs.Stats & {fullPath: string}>();
  readonly videos = new Map<string, fs.Stats & {fullPath: string}>();
}
