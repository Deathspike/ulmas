import * as app from '..';
import * as nws from '@nestjs/websockets';
import * as ws from 'ws';
import {EventService} from './services/EventService';

@nws.WebSocketGateway()
export class Gateway implements nws.OnGatewayConnection<ws.WebSocket>, nws.OnGatewayDisconnect<ws.WebSocket> {
  private readonly clients: Array<Client> = [];

  constructor(
    private readonly eventService: EventService) {}

  handleConnection(ws: ws.WebSocket) {
    const eventHandler = this.sendAsync.bind(ws);
    this.eventService.addEventListener(eventHandler);
    this.clients.push({ws, eventHandler});
  }

  handleDisconnect(ws: ws.WebSocket) {
    const index = this.clients.findIndex(x => x.ws === ws);
    if (index === -1) return;
    this.clients.splice(index, 1).forEach(x => this.eventService.removeEventListener(x.eventHandler));
  }

  private sendAsync(this: ws.WebSocket, event: app.api.models.Event) {
    this.send(JSON.stringify(event));
    return Promise.resolve();
  }
}

type Client = {
  eventHandler: (event: app.api.models.Event) => Promise<void>;
  ws: ws.WebSocket;
};
