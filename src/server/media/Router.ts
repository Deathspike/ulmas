import * as app from '..';
import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';
import {Mpv} from './classes/Mpv';
import {LocalRequestGuard} from './guards/LocalRequestGuard';

@nst.Controller('api/media')
@swg.ApiTags('media')
export class Router {
  @nst.UseGuards(LocalRequestGuard)
  @nst.Post('mpv')
  @nst.HttpCode(200)
  @swg.ApiResponse({status: 200, type: app.api.models.MediaStatus})
  @swg.ApiResponse({status: 403})
  async mpvAsync(
    @nst.Body() media: app.api.models.MediaRequest) {
    const player = new Mpv();
    const status = await player.openAsync(media.position, media.subtitleUrls, media.videoUrl);
    return new app.api.models.MediaStatus(status);
  }
}
