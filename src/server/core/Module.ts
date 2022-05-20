import * as mod from '.';
import * as nst from '@nestjs/common';

@nst.Module({
  providers: [mod.CacheService, mod.ContextService],
  exports: [mod.CacheService, mod.ContextService]})
export class Module {}
