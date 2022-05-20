import * as app from '..';
import * as mod from '.';
import * as nst from '../../nest';

@nst.Module({
  imports: [app.media.Module, app.sections.Module],
  controllers: [mod.Router],
  providers: [mod.Service],
  exports: [mod.Service]})
export class Module {}
