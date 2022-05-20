import * as app from '..';
import * as nst from '@nestjs/common';
import {Movie} from './models/Movie';
import fs from 'fs';
import path from 'path';

// TODO: more detail, like genres, links

@nst.Injectable()
export class Service {
  // [CACHE] When introducing cache, use movieDetailAsync to prime that cache, too.
  async movieListAsync(rootPaths: Array<string>) {
    const movies: Array<app.api.models.ItemOfMovies> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      const directoryNames = await fs.promises.readdir(rootPath).catch(() => []);
      await Promise.all(directoryNames.map(async (parentName) => {
        const resourcePath = path.join(rootPath, parentName);
        const resourceNames = await fs.promises.readdir(resourcePath).catch(() => []);
        await Promise.all(resourceNames.filter(x => /(?<!movie)\.nfo$/i.test(x)).map(async (infoName) => {
          const moviePath = path.join(resourcePath, infoName.substring(0, infoName.length - 4));
          const movieInfo = await Movie.loadAsync(moviePath).catch(() => undefined);
          const movieValue = app.createValue(moviePath, movieInfo);
          if (movieInfo && movieValue) movies.push(new app.api.models.ItemOfMovies(movieValue));
        }));
      }));
    }));
    movies.sort((a, b) => a.title.localeCompare(b.title));
    return movies;
  }

  async movieDetailAsync(moviePath: string) {
    const movieInfo = await Movie.loadAsync(moviePath);
    const movieValue = app.createValue(moviePath, movieInfo);
    return new app.api.models.Movie(movieValue);
  }
}
