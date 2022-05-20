import * as app from '..';
import * as nst from '@nestjs/common';
import {Movie} from './models/Movie';
import path from 'path';
const logger = new nst.Logger('Movies.Service');

@nst.Injectable()
export class Service {
  constructor(
    private readonly coreService: app.core.Service) {}

  async listAsync(rootPaths: Array<string>) {
    const result: Array<app.api.models.Movie> = [];
    await Promise.all(rootPaths.map(async (rootPath) => {
      const context = await this.coreService
        .contextAsync(rootPath);
      const rootMovies = await Promise.all(Object
        .entries(context.info)
        .filter(([x]) => x !== 'movie.nfo')
        .map(([_, x]) => this.tryAsync(context, x)));
      const subdirContexts = await Promise.all(Object
        .values(context.directories)
        .map(x => this.coreService.contextAsync(x)));
      const subdirMovies = await Promise.all(subdirContexts.flatMap(context => Object
        .values(context.info)
        .filter(x => x !== 'movie.nfo')
        .map(x => this.tryAsync(context, x))));
      result.push(...ensure(rootMovies.concat(subdirMovies)));
    }));
    result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }

  private async tryAsync(context: app.core.Context, moviePath: string) {
    return await Movie.loadAsync(moviePath)
      .then(x => this.create(context, x, moviePath))
      .catch(() => logger.warn(`Invalid movie: ${moviePath}`));
  }

  private create(context: app.core.Context, movieInfo: Movie, moviePath: string) {
    const {name} = path.parse(moviePath);
    const images = Object.entries(context.images)
      .filter(([x]) => x.startsWith(`${name}-`))
      .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'image'})));
    const subtitles = Object.entries(context.subtitles)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'subtitle'})));
    const videos = Object.entries(context.videos)
      .filter(([x]) => x.startsWith(`${name}.`))
      .map(([_, x]) => new app.api.models.Media(app.create(x, {type: 'video'})));
    return new app.api.models.Movie(app.create(moviePath, {
      ...movieInfo,
      media: images.concat(subtitles, videos),
    }));
  }
}

function ensure<T>(items: Array<T | void>): Array<T> {
  return items.filter(Boolean) as Array<T>;
}
