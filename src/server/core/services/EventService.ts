import * as app from '../..';
import * as nst from '@nestjs/common';

@nst.Injectable()
export class EventService {
  private readonly handlers: Array<(event: app.api.models.Event) => void>;

  constructor() {
    this.handlers = [];
  }

  addEventListener(handler: (event: app.api.models.Event) => void) {
    this.handlers.push(handler);
  }

  removeEventListener(handler: (event: app.api.models.Event) => void) {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) this.handlers.splice(index, 1);
  }
  
  send(source: string, reason: string, sectionId: string, resourceId?: string) {
    const event = new app.api.models.Event({source, reason, sectionId, resourceId});
    this.handlers.forEach(x => x(event));
  }
}
