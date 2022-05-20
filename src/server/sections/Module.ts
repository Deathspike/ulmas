import * as nst from '@nestjs/common';
import {Router} from './Router';
import {Service} from './Service';

@nst.Module({
  controllers: [Router],
  providers: [Service],
  exports: [Service]})
export class Module {}
