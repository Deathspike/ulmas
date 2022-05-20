import * as app from '.';
import * as nst from '@nestjs/common';

@nst.Module({imports: [app.media.Module, app.sections.Module, app.movies.Module, app.series.Module]})
export class ServerModule {}
