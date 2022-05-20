import * as app from '..';
import * as nst from '@nestjs/common';
import {Router} from './Router';
import {Service} from './Service';

@nst.Module({
  imports: [app.core.Module, app.sections.Module],
  controllers: [Router],
  providers: [Service],
  exports: [Service]})
export class Module {}
