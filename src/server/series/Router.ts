import * as app from '..';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {SectionCache} from './cache/SectionCache';
import {SeriesCache} from './cache/SeriesCache';
import {Service} from './Service';
import express from 'express';
import fs from 'fs';

@nst.Controller('api/series')
@swg.ApiTags('series')
export class Router {
  constructor(
    private readonly sectionsService: app.sections.Service,
    private readonly seriesService: Service) {}
  
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.SeriesEntry]})
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
    const sectionList = await this.sectionsService.readAsync('series');
    const section = sectionList.find(x => x.id === params.sectionId);
    if (!section) throw new nst.NotFoundException();
    await this.seriesService.scanRootAsync(section.id, section.paths);
  }

  @nst.Get(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Series})
  @swg.ApiResponse({status: 404})
  async getItemAsync(
    @nst.Param() params: app.api.params.Resource,
    @nst.Response() response: express.Response) {
    const cache = new SeriesCache(params.sectionId, params.resourceId);
    response.type('json');
    response.sendFile(cache.fullPath, () => response.status(404).end());
  }

  @nst.Patch(':sectionId/:resourceId')
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  @swg.ApiResponse({status: 404})
  async patchItemAsync(
    @nst.Param() params: app.api.params.Resource,
    @nst.Body() body: app.api.models.SeriesPatch) {
    const cache = new SectionCache(params.sectionId);
    const stats = await fs.promises.stat(cache.fullPath).catch(() => {});
    if (!stats) await this.scanListAsync(params);
    if (!await this.seriesService.patchAsync(params.sectionId, params.resourceId, body)) throw new nst.NotFoundException();
  }
  
  @nst.Put(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Series})
  @swg.ApiResponse({status: 404})
  async scanItemAsync(
    @nst.Param() params: app.api.params.Resource) {
    const cache = new SectionCache(params.sectionId);
    const stats = await fs.promises.stat(cache.fullPath).catch(() => {});
    if (!stats) await this.scanListAsync(params);
    if (!await this.seriesService.scanSeriesAsync(params.sectionId, params.resourceId)) throw new nst.NotFoundException();
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
    const series = await new SeriesCache(params.sectionId, params.resourceId).loadAsync();
    const media = Array.from(mediaOf(series));
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

function *mediaOf(series: app.api.models.Series) {
  if (series.images) yield *series.images;
  for (let episode of series.episodes) {
    if (episode.media.images) yield *episode.media.images;
    if (episode.media.subtitles) yield *episode.media.subtitles;
    if (episode.media.videos) yield *episode.media.videos;
  }
}
