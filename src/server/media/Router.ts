import * as app from '..';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {Mpv} from './classes/Mpv';
import {LocalRequestGuard} from './guards/LocalRequestGuard';
import express from 'express';

@nst.Controller('api/media')
@swg.ApiTags('media')
export class Router {
  @nst.UseGuards(LocalRequestGuard)
  @nst.Post('mpv')
  @nst.HttpCode(200)
  @swg.ApiResponse({status: 200, type: app.api.models.MediaResume})
  @swg.ApiResponse({status: 403})
  async mpvAsync(
    @nst.Body() media: app.api.models.MediaRequest,
    @nst.Response({passthrough: true}) response: express.Response) {
    const player = new Mpv();
    const signal = this.createAbortSignal(response);
    const status = await player.openAsync(signal, media.position, media.subtitleUrls, media.videoUrl);
    return new app.api.models.MediaResume(status);
  }

  private createAbortSignal(response: express.Response) {
    const controller = new AbortController();
    response.on('close', controller.abort.bind(controller));
    return controller.signal;
  }
}
