import * as mod from '.';
import * as nst from '@nestjs/common';

@nst.Module({
  controllers: [mod.Router]})
export class Module {}
