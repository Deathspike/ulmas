import * as app from '..';
import * as mod from '.';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {mapEntry} from './maps/mapEntry';
import {mapSeries} from './maps/mapSeries';
import express from 'express';
const logger = new nst.Logger('Series');

@nst.Controller('api/series')
@swg.ApiTags('series')
export class Router implements nst.OnModuleInit {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly sectionsService: app.sections.Service,
    private readonly seriesService: mod.Service) {}
 
  @nst.Put()
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  async checkAsync() {
    const invalidator = this.cacheService.invalidate('series');
    const sectionList = await this.sectionsService.readAsync('series');
    await this.seriesService.refreshAsync(Array.from(new Set(sectionList.flatMap(x => x.paths))));
    await invalidator();
  }
  
  @app.Validator([app.api.models.ItemOfSeries])
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.ItemOfSeries]})
  @swg.ApiResponse({status: 404})
  async listAsync(
    @nst.Param() params: app.api.params.Section) {
    const section = await this.sectionAsync(params.sectionId);
    const seriesList = await this.seriesService.listAsync(section.paths);
    return seriesList.map(mapEntry);
  }

  @app.Validator(app.api.models.Series)
  @nst.Get(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Series})
  @swg.ApiResponse({status: 404})
  async detailAsync(
    @nst.Param() params: app.api.params.Resource) {
    const series = await this.valueAsync(params.sectionId, params.resourceId);
    return mapSeries(series);
  }
  
  @nst.Get(':sectionId/:resourceId/:mediaId')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async mediaAsync(
    @nst.Param() params: app.api.params.Media,
    @nst.Request() request: express.Request,
    @nst.Response() response: express.Response) {
    const series = await this.valueAsync(params.sectionId, params.resourceId);
    const mediaList = series.media.concat(series.episodes.flatMap(x => x.media));
    const media = mediaList.find(x => x.id === params.mediaId);
    if (!media) throw new nst.NotFoundException();
    const mtime = Date.parse(request.headers['if-modified-since'] ?? '');
    if (mtime >= media.mtime) throw new nst.HttpException(media.path, 304);
    response.sendFile(media.path);
  }

  onModuleInit() {
    this.checkAsync().catch(x => logger.error(x));
  }

  private async sectionAsync(sectionId: string) {
    const sectionList = await this.sectionsService.readAsync('series');
    const section = sectionList.find(x => x.id === sectionId);
    if (!section) throw new nst.NotFoundException();
    return section;
  }

  private async valueAsync(sectionId: string, resourceId: string) {
    const section = await this.sectionAsync(sectionId);
    const seriesList = await this.seriesService.listAsync(section.paths);
    const series = seriesList.find(x => x.id === resourceId);
    if (!series) throw new nst.NotFoundException();
    return series;
  }
}
