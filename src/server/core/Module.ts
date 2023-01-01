import * as app from '.';
import * as nst from '@nestjs/common';
import {Gateway} from './Gateway';

@nst.Module({
  providers: [
    app.CacheService,
    app.ContextService,
    app.EventService,
    app.LockService,
    app.TimeService,
    Gateway
  ],
  exports: [
    app.CacheService,
    app.ContextService,
    app.EventService,
    app.LockService,
    app.TimeService
  ]
})
export class Module {}
