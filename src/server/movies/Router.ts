import * as app from '..';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {Service} from './Service';
import {mapMovie} from './maps/mapMovie';
import {mapMovieListItem} from './maps/mapMovieListItem';
import express from 'express';
const logger = new nst.Logger('Movies');

@nst.Controller('api/movies')
@swg.ApiTags('movies')
export class Router {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly moviesService: Service,
    private readonly sectionsService: app.sections.Service) {}

  @nst.Put()
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  async checkAsync() {
    const invalidator = this.cacheService.invalidate('movies');
    const sectionList = await this.sectionsService.readAsync('movies');
    const paths = new Set(sectionList.flatMap(x => x.paths));
    await this.moviesService.refreshAsync(Array.from(paths));
    await invalidator();
  }
  
  @app.Validator([app.api.models.MovieListItem])
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.MovieListItem]})
  @swg.ApiResponse({status: 404})
  async listAsync(
    @nst.Param() params: app.api.params.Section) {
    const section = await this.sectionAsync(params.sectionId);
    const movieList = await this.moviesService.listAsync(section.paths);
    return movieList.map(mapMovieListItem);
  }

  @app.Validator(app.api.models.Movie)
  @nst.Get(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Movie})
  @swg.ApiResponse({status: 404})
  async detailAsync(
    @nst.Param() params: app.api.params.Resource) {
    const movie = await this.valueAsync(params.sectionId, params.resourceId);
    return mapMovie(movie);
  }

  @nst.Get(':sectionId/:resourceId/:mediaId')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async mediaAsync(
    @nst.Param() params: app.api.params.Media,
    @nst.Request() request: express.Request,
    @nst.Response() response: express.Response) {
    const movie = await this.valueAsync(params.sectionId, params.resourceId);
    const media = movie.sources.find(x => x.id === params.mediaId);
    if (!media) throw new nst.NotFoundException();
    const mtime = Date.parse(request.headers['if-modified-since'] ?? '');
    if (mtime >= media.mtime) throw new nst.HttpException(media.path, 304);
    response.sendFile(media.path, () => response.status(404).end());
  }

  onModuleInit() {
    if (app.isDebugging()) return;
    this.checkAsync().catch(x => logger.error(x));
  }

  private async sectionAsync(sectionId: string) {
    const sectionList = await this.sectionsService.readAsync('movies');
    const section = sectionList.find(x => x.id === sectionId);
    if (!section) throw new nst.NotFoundException();
    return section;
  }
  
  private async valueAsync(sectionId: string, resourceId: string) {
    const section = await this.sectionAsync(sectionId);
    const movieList = await this.moviesService.listAsync(section.paths);
    const movie = movieList.find(x => x.id === resourceId);
    if (!movie) throw new nst.NotFoundException();
    return movie;
  }
}
