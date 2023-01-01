import * as nst from '@nestjs/common';
import {Router} from './Router';

@nst.Module({
  controllers: [Router]
})
export class Module {}
