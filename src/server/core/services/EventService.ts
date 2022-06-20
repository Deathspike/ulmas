import * as nst from '@nestjs/common';

@nst.Injectable()
export class EventService {
  private readonly handlers: Array<(event: Event) => void>;

  constructor() {
    this.handlers = [];
  }

  addEventListener(handler: (event: Event) => void) {
    this.handlers.push(handler);
  }

  removeEventListener(handler: (event: Event) => void) {
    const index = this.handlers.indexOf(handler);
    if (index === -1) return;
    this.handlers.splice(index, 1);
  }
  
  send(source: Event['source'], reason: Event['reason'], sectionId: string, resourceId?: string) {
    const event = {source, reason, sectionId, resourceId} as Event;
    this.handlers.forEach(x => x(event));
    return event;
  }
}

type Event = {
  source: 'movies' | 'sections' | 'series';
  reason: 'delete' | 'update';
  sectionId: string;
  resourceId?: string;
}
