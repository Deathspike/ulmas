import * as mod from '.';
import * as nst from '@nestjs/common';

@nst.Module({
  providers: [mod.Service],
  exports: [mod.Service]})
export class Module {}
