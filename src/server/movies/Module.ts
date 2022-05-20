import * as app from '..';
import * as mod from '.';
import * as nst from '@nestjs/common';

@nst.Module({
  imports: [app.core.Module, app.sections.Module],
  controllers: [mod.Router],
  providers: [mod.Service],
  exports: [mod.Service]})
export class Module {}
