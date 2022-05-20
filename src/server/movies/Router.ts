import * as app from '..';
import * as mod from '.';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import express from 'express';
const logger = new nst.Logger('Movies');

@nst.Controller('api/movies')
@swg.ApiTags('movies')
export class Router implements nst.OnModuleInit {
  constructor(
    private readonly cacheService: app.core.CacheService,
    private readonly moviesService: mod.Service,
    private readonly sectionsService: app.sections.Service) {}

  @nst.Put()
  @nst.HttpCode(204)
  @swg.ApiResponse({status: 204})
  async checkAsync() {
    const invalidator = this.cacheService.invalidate('movies');
    const sectionList = await this.sectionsService.readAsync('movies');
    await this.moviesService.refreshAsync(Array.from(new Set(sectionList.flatMap(x => x.paths))));
    await invalidator();
  }
  
  @app.Validator([app.api.models.ItemOfMovies])
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.ItemOfMovies]})
  @swg.ApiResponse({status: 404})
  async listAsync(
    @nst.Param() params: app.api.params.Section) {
    const section = await this.sectionAsync(params.sectionId);
    const movieList = await this.moviesService.listAsync(section.paths);
    return movieList.map(x => new app.api.models.ItemOfMovies(x, {
      media: x.media.filter(x => x.type === 'image')
    }));
  }

  @app.Validator(app.api.models.Movie)
  @nst.Get(':sectionId/:resourceId')
  @swg.ApiResponse({status: 200, type: app.api.models.Movie})
  @swg.ApiResponse({status: 404})
  async detailAsync(
    @nst.Param() params: app.api.params.Resource) {
    const section = await this.sectionAsync(params.sectionId);
    const movieList = await this.moviesService.listAsync(section.paths);
    const movie = movieList.find(x => x.id === params.resourceId);
    if (!movie) throw new nst.NotFoundException();
    return movie;
  }

  @nst.Get(':sectionId/:resourceId/:mediaId')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async mediaAsync(
    @nst.Param() params: app.api.params.Media,
    @nst.Response() response: express.Response) {
    const movie = await this.detailAsync(params);
    const media = movie.media.find(x => x.id === params.mediaId);
    if (!media) throw new nst.NotFoundException();
    response.attachment(media.path);
    response.sendFile(media.path, () => response.status(404).end());
  }

  onModuleInit() {
    this.checkAsync().catch(x => logger.error(x));
  }
  
  private async sectionAsync(sectionId: string) {
    const sectionList = await this.sectionsService.readAsync('movies');
    const section = sectionList.find(x => x.id === sectionId);
    if (!section) throw new nst.NotFoundException();
    return section;
  }
}
