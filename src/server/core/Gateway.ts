import * as app from '..';
import * as nws from '@nestjs/websockets';
import * as ws from 'ws';
import {EventService} from './services/EventService';

@nws.WebSocketGateway()
export class Gateway implements nws.OnGatewayConnection<ws.WebSocket>, nws.OnGatewayDisconnect<ws.WebSocket> {
  private readonly clients: Array<ws.WebSocket>;

  constructor(eventService: EventService) {
    this.clients = [];
    eventService.addEventListener(x => this.send(x));
  }

  handleConnection(client: ws.WebSocket) {
    this.clients.push(client);
  }

  handleDisconnect(client: ws.WebSocket) {
    const index = this.clients.indexOf(client);
    if (index !== -1) this.clients.splice(index, 1);
  }

  private send(event: app.api.models.Event) {
    if (!this.clients.length) return;
    const value = JSON.stringify(event);
    this.clients.forEach(x => x.send(value));
  }
}
