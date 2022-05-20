import * as mod from '.';
import * as nst from '@nestjs/common';

@nst.Module({
  controllers: [mod.Router],
  providers: [mod.Service],
  exports: [mod.Service]})
export class Module {}
