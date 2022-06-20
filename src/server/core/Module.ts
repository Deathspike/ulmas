import * as app from '.';
import * as nst from '@nestjs/common';

@nst.Module({
  providers: [app.CacheService, app.ContextService, app.EventService, app.LockService],
  exports: [app.CacheService, app.ContextService, app.EventService, app.LockService]})
export class Module {}
