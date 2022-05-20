import * as nst from '@nestjs/common';
import {CacheService} from './services/CacheService';
import {ContextService} from './services/ContextService';

@nst.Module({
  providers: [CacheService, ContextService],
  exports: [CacheService, ContextService]})
export class Module {}
