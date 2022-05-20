import * as app from '..';
import * as mod from '.';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import express from 'express';

@nst.Controller('api/series')
@swg.ApiTags('series')
export class Router {
  constructor(
    private readonly sectionsService: app.sections.Service,
    private readonly seriesService: mod.Service) {}

  @app.Validator([app.api.models.ItemOfSeries])
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.ItemOfSeries]})
  @swg.ApiResponse({status: 404})
  async listAsync(
    @nst.Param() params: app.api.params.Section) {
    const section = await this.sectionAsync(params.sectionId);
    const seriesList = await this.seriesService.listAsync(section.paths);
    return seriesList.map(x => new app.api.models.ItemOfSeries(x));
  }

  @app.Validator(app.api.models.Series)
  @nst.Get(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Series})
  @swg.ApiResponse({status: 404})
  async detailAsync(
    @nst.Param() params: app.api.params.Resource) {
    const section = await this.sectionAsync(params.sectionId);
    const seriesList = await this.seriesService.listAsync(section.paths);
    const series = seriesList.find(x => x.id === params.resourceId);
    if (!series) throw new nst.NotFoundException();
    return await this.seriesService.detailAsync(series);
  }
  
  @nst.Get(':sectionId/:resourceId/:mediaId')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async mediaAsync(
    @nst.Param() params: app.api.params.Media,
    @nst.Response() response: express.Response) {
    const series = await this.detailAsync(params);
    const mediaList = series.media.concat(series.episodes.flatMap(x => x.media));
    const media = mediaList.find(x => x.id === params.mediaId);
    if (!media) throw new nst.NotFoundException();
    response.attachment(media.path);
    response.sendFile(media.path, () => response.status(404).end());
  }

  private async sectionAsync(sectionId: string) {
    const sectionList = await this.sectionsService.readAsync();
    const section = sectionList.find(x => x.id === sectionId);
    if (!section) throw new nst.NotFoundException();
    return section;
  }
}
