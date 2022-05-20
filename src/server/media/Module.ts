import * as mod from '.';
import * as nst from '../../nest';

@nst.Module({
  providers: [mod.Service],
  exports: [mod.Service]})
export class Module {}
