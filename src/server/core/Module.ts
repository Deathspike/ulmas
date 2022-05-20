import * as nst from '@nestjs/common';
import {CacheService} from './services/CacheService';
import {ContextService} from './services/ContextService';
import {LockService} from './services/LockService';

@nst.Module({
  providers: [CacheService, ContextService, LockService],
  exports: [CacheService, ContextService, LockService]})
export class Module {}
