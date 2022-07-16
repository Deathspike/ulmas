import * as app from '../..';
import * as nst from '@nestjs/common';
const logger = new nst.Logger('Core');

@nst.Injectable()
export class EventService {
  private readonly handlers: Array<(event: app.api.models.Event) => Promise<void>>;

  constructor() {
    this.handlers = [];
  }

  addEventListener(handler: (event: app.api.models.Event) => Promise<void>) {
    this.handlers.push(handler);
  }

  removeEventListener(handler: (event: app.api.models.Event) => Promise<void>) {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) this.handlers.splice(index, 1);
  }
  
  async sendAsync(type: string, sectionId: string) {
    for (const handler of this.handlers) {
      const event = new app.api.models.Event({type, sectionId});
      await handler(event).catch(x => logger.error(x));
    }
  }
}
