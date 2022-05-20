import * as app from '..';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {SectionCache} from './cache/SectionCache';
import {MovieCache} from './cache/MovieCache';
import {StreamCache} from './cache/StreamCache';
import {Service} from './Service';
import express from 'express';
import fs from 'fs';

@nst.Controller('api/movies')
@swg.ApiTags('movies')
export class Router {
  constructor(
    private readonly moviesService: Service,
    private readonly sectionsService: app.sections.Service) {}
 
  @nst.Put(':sectionId')
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  @swg.ApiResponse({status: 404})
  async checkAsync(
    @nst.Param() params: app.api.params.Section) {
    const sectionList = await this.sectionsService.readAsync('movies');
    const section = sectionList.find(x => x.id === params.sectionId);
    if (!section) throw new nst.NotFoundException();
    await this.moviesService.checkAsync(section.id, section.paths);
  }
  
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.MovieListItem]})
  @swg.ApiResponse({status: 404})
  async everyAsync(
    @nst.Param() params: app.api.params.Section,
    @nst.Response() response: express.Response) {
    const cache = new SectionCache(params.sectionId);
    const stats = await fs.promises.stat(cache.fullPath).catch(() => {});
    if (!stats) await this.checkAsync(params);
    response.type('json');
    response.sendFile(cache.fullPath, () => response.status(404).end());
  }

  @nst.Get(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Movie})
  @swg.ApiResponse({status: 404})
  async itemAsync(
    @nst.Param() params: app.api.params.Resource,
    @nst.Response() response: express.Response) {
    const cache = new MovieCache(params.sectionId, params.resourceId);
    response.type('json');
    response.sendFile(cache.fullPath, () => response.status(404).end());
  }
  
  @nst.Get(':sectionId/:resourceId/:mediaId')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async mediaAsync(
    @nst.Param() params: app.api.params.Media,
    @nst.Request() request: express.Request,
    @nst.Response() response: express.Response) {
    const media = await this.findAsync(params);
    if (!media) throw new nst.NotFoundException();
    const mtime = Date.parse(request.headers['if-modified-since'] ?? '');
    if (mtime >= media.mtime) throw new nst.HttpException(media.path, 304);
    response.sendFile(media.path, () => response.status(404).end());
  }

  private async findAsync(params: app.api.params.Media) {
    return await new StreamCache(params.sectionId, params.resourceId)
      .loadAsync().then(x => x.get(params.mediaId))
      .catch(() => {});
  }
}
