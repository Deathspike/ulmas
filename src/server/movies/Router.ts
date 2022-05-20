import * as app from '..';
import * as mod from '.';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import express from 'express';

@nst.Controller('api/movies')
@swg.ApiTags('movies')
export class Router {
  constructor(
    private readonly mediaService: app.media.Service,
    private readonly moviesService: mod.Service,
    private readonly sectionsService: app.sections.Service) {}

  @app.Validator([app.api.models.ItemOfMovies])
  @nst.Get(':sectionId')
  @swg.ApiResponse({status: 200, type: [app.api.models.ItemOfMovies]})
  @swg.ApiResponse({status: 404})
  async movieListAsync(
    @nst.Param() params: app.api.params.Section) {
    const sectionList = await this.sectionsService.sectionListAsync();
    const section = sectionList.find(x => x.id === params.sectionId);
    if (!section) throw new nst.NotFoundException();
    return await this.moviesService.movieListAsync(section.paths);
  }

  @app.Validator(app.api.models.Movie)
  @nst.Get(':sectionId/:movieId')
  @swg.ApiResponse({status: 200, type: app.api.models.Movie})
  @swg.ApiResponse({status: 404})
  async movieDetailAsync(
    @nst.Param() params: app.api.params.Movie) {
    const movieList = await this.movieListAsync(params);
    const movie = movieList.find(x => x.id === params.movieId);
    if (!movie) throw new nst.NotFoundException();
    return await this.moviesService.movieDetailAsync(movie.path);
  }

  @nst.Get(':sectionId/:movieId/image')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async movieImageAsync(
    @nst.Param() params: app.api.params.Movie,
    @nst.Query() query: app.api.queries.Image,
    @nst.Response() response: express.Response) {
    const movie = await this.movieDetailAsync(params);
    const filePath = await this.mediaService.imageAsync(movie.path.replace(/\..*$/, `-${query.imageName}`));
    if (!filePath) throw new nst.NotFoundException();
    response.attachment(filePath);
    response.sendFile(filePath, () => response.status(404).end());
  }

  @nst.Get(':sectionId/:movieId/video')
  @swg.ApiResponse({status: 200})
  @swg.ApiResponse({status: 404})
  async movieVideoAsync(
    @nst.Param() params: app.api.params.Movie,
    @nst.Response() response: express.Response) {
    const movie = await this.movieDetailAsync(params);
    response.attachment(movie.path);
    response.sendFile(movie.path, () => response.status(404).end());
  }
}
