import * as mod from '.';
import * as nst from '@nestjs/common';

@nst.Injectable()
export class Service {
  async contextAsync(rootPath: string) {
    return await mod.Context.loadAsync(rootPath);
  }
}
