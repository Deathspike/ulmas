import * as app from '..';
import * as mod from '.';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import express from 'express';
import path from 'path';

@nst.Controller('api/series')
@swg.ApiTags('series')
export class Router {
  constructor(
    private readonly mediaService: app.media.Service,
    private readonly sectionsService: app.sections.Service,
    private readonly seriesService: mod.Service) {}

  @app.Validator([app.api.models.ItemOfSeries])
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.ItemOfSeries]})
  @swg.ApiResponse({status: 404})
  async seriesListAsync(
    @nst.Param() params: app.api.params.Section) {
    const sectionList = await this.sectionsService.sectionListAsync();
    const section = sectionList.find(x => x.id === params.sectionId);
    if (!section) throw new nst.NotFoundException();
    return await this.seriesService.seriesListAsync(section.paths);
  }

  @app.Validator(app.api.models.Series)
  @nst.Get(':sectionId/:seriesId')
  @swg.ApiResponse({status: 200, type: app.api.models.Series})
  @swg.ApiResponse({status: 404})
  async seriesDetailAsync(
    @nst.Param() params: app.api.params.Series) {
    const seriesList = await this.seriesListAsync(params);
    const series = seriesList.find(x => x.id === params.seriesId);
    if (!series) throw new nst.NotFoundException();
    return await this.seriesService.seriesDetailAsync(series.path);
  }

  @nst.Get(':sectionId/:seriesId/image')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async seriesImageAsync(
    @nst.Param() params: app.api.params.Series,
    @nst.Query() query: app.api.queries.Image,
    @nst.Response() response: express.Response) {
    const series = await this.seriesDetailAsync(params);
    const filePath = await this.mediaService.imageAsync(path.join(series.path, query.imageName));
    if (!filePath) throw new nst.NotFoundException();
    response.attachment(filePath);
    response.sendFile(filePath, () => response.status(404).end());
  }

  @app.Validator(app.api.models.Episode)
  @nst.Get(':sectionId/:seriesId/:episodeId')
  @swg.ApiResponse({status: 200, type: app.api.models.Episode})
  @swg.ApiResponse({status: 404})
  async episodeDetailAsync(
    @nst.Param() params: app.api.params.Episode) {
    const series = await this.seriesDetailAsync(params);
    const episode = series.episodes.find(x => x.id === params.episodeId);
    if (!episode) throw new nst.NotFoundException();
    return await this.seriesService.episodeDetailAsync(episode.path);
  }

  @nst.Get(':sectionId/:seriesId/:episodeId/image')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async episodeImageAsync(
    @nst.Param() params: app.api.params.Episode,
    @nst.Query() query: app.api.queries.Image,
    @nst.Response() response: express.Response) {
    const episode = await this.episodeDetailAsync(params);
    const filePath = await this.mediaService.imageAsync(episode.path.replace(/\..*$/, `-${query.imageName}`));
    if (!filePath) throw new nst.NotFoundException();
    response.attachment(filePath);
    response.sendFile(filePath, () => response.status(404).end());
  }
   
  @nst.Get(':sectionId/:seriesId/:episodeId/video')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async episodeVideoAsync(
    @nst.Param() params: app.api.params.Episode,
    @nst.Response() response: express.Response) {
    const episode = await this.episodeDetailAsync(params);
    response.attachment(episode.path);
    response.sendFile(episode.path, () => response.status(404).end());
  }
}
