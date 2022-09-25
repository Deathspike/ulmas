import * as app from '..';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {SectionCache} from './cache/SectionCache';
import {MovieCache} from './cache/MovieCache';
import {Service} from './Service';
import express from 'express';
import fs from 'fs';

@nst.Controller('api/movies')
@swg.ApiTags('movies')
export class Router {
  constructor(
    private readonly moviesService: Service,
    private readonly sectionsService: app.sections.Service) {}
 
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.MovieEntry]})
  @swg.ApiResponse({status: 404})
  async getListAsync(
    @nst.Param() params: app.api.params.Section,
    @nst.Response() response: express.Response) {
    const cache = new SectionCache(params.sectionId);
    const stats = await fs.promises.stat(cache.fullPath).catch(() => {});
    if (!stats) await this.scanListAsync(params);
    response.type('json');
    response.sendFile(cache.fullPath, () => response.status(404).end());
  }

  @nst.Put(':sectionId')
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  @swg.ApiResponse({status: 404})
  async scanListAsync(
    @nst.Param() params: app.api.params.Section) {
    const sectionList = await this.sectionsService.readAsync();
    const section = sectionList.find(x => x.id === params.sectionId && x.type === 'movies');
    if (!section) throw new nst.NotFoundException();
    await this.moviesService.scanRootAsync(section.id, section.paths);
  }

  @nst.Get(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Movie})
  @swg.ApiResponse({status: 404})
  async getItemAsync(
    @nst.Param() params: app.api.params.Resource,
    @nst.Response() response: express.Response) {
    const cache = new MovieCache(params.sectionId, params.resourceId);
    response.type('json');
    response.sendFile(cache.fullPath, () => response.status(404).end());
  }
  
  @nst.Patch(':sectionId/:resourceId')
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  @swg.ApiResponse({status: 404})
  async patchItemAsync(
    @nst.Param() params: app.api.params.Resource,
    @nst.Body() body: app.api.models.MoviePatch) {
    const cache = new SectionCache(params.sectionId);
    const stats = await fs.promises.stat(cache.fullPath).catch(() => {});
    if (!stats) await this.scanListAsync(params);
    if (!await this.moviesService.patchAsync(params.sectionId, params.resourceId, body)) throw new nst.NotFoundException();
  }
  
  @nst.Put(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Series})
  @swg.ApiResponse({status: 404})
  async scanItemAsync(
    @nst.Param() params: app.api.params.Resource) {
    const cache = new SectionCache(params.sectionId);
    const stats = await fs.promises.stat(cache.fullPath).catch(() => {});
    if (!stats) await this.scanListAsync(params);
    if (!await this.moviesService.scanMovieAsync(params.sectionId, params.resourceId)) throw new nst.NotFoundException();
  }

  @nst.Get(':sectionId/:resourceId/:mediaId')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async mediaAsync(
    @nst.Param() params: app.api.params.Media,
    @nst.Response() response: express.Response) {
    const filePath = await this.findAsync(params).catch(() => {});
    if (!filePath) throw new nst.NotFoundException();
    response.attachment(filePath);
    response.set('Cache-Control', 'max-age=31536000');
    response.sendFile(filePath, () => response.status(404).end());
  }

  private async findAsync(params: app.api.params.Media) {
    const movie = await new MovieCache(params.sectionId, params.resourceId).loadAsync();
    const media = Array.from(mediaOf(movie));
    if (/\.sub$/i.test(params.mediaId)) {
      const mediaId = params.mediaId.replace(/\.sub$/i, '');
      const result = media.find(x => x.id === mediaId);
      return result?.path.replace(/\.idx$/i, '.sub');
    } else {
      const result = media.find(x => x.id === params.mediaId);
      return result?.path;
    }
  }
}

function *mediaOf(movie: app.api.models.Movie) {
  if (movie.media.images) yield *movie.media.images;
  if (movie.media.subtitles) yield *movie.media.subtitles;
  if (movie.media.videos) yield *movie.media.videos;
}
