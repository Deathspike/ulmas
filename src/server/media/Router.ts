import * as nst from '@nestjs/common';
import * as swg from '@nestjs/swagger';

@nst.Controller('api/media')
@swg.ApiTags('media')
export class Router {
  // if not local, deny request
  // otherwise accept object w/ mpv path (lives in UI after all), videourl & Array<subtitleurl> to spawn fullscreen mpv
  //   ^ this model could be returned from Service.ts for searches, too /movies/{movieId}/media... gives a bunch of URLs that can be passed into play!
  // return localtime & totaltime when mpv exits (if exists)
  // with this setup, we can keep electron in this repository as well...! because it embeds server too... :-]
}
