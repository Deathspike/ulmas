import * as api from 'api';

export class EventService {
  private readonly baseUrl = new URL(`ws://${window.location.hostname}:6877/`); // HTTPS
  private readonly handlers: Array<(event: api.models.Event) => Promise<void>>;
  private receiveQueue = Promise.resolve();
  private socket?: WebSocket;

  constructor() {
    this.handlers = [];
  }

  addEventListener(handler: (event: api.models.Event) => Promise<void>) {
    this.handlers.push(handler);
    this.tryConnect();
  }

  removeEventListener(handler: (event: api.models.Event) => Promise<void>) {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) this.handlers.splice(index, 1);
    requestAnimationFrame(() => this.tryDisconnect());
  }

  private connect() {
    this.socket = new WebSocket(this.baseUrl);
    this.socket.addEventListener('close', () => this.disconnect());
    this.socket.addEventListener('error', () => this.disconnect());
    this.socket.addEventListener('message', x => this.receive(x));
  }

  private disconnect() {
    if (!this.socket || this.socket.readyState === this.socket.CLOSING) return;
    this.socket.close();
    this.socket = undefined;
    this.tryConnect();
  }

  private receive(message: MessageEvent<string>) {
    this.receiveQueue = this.receiveQueue.then(async () => {
      for (const handler of this.handlers) {
        const event = new api.models.Event(JSON.parse(message.data));
        await handler(event).catch(x => console.error(x));
      }
    });
  }

  private tryConnect() {
    if (!this.handlers.length || this.socket) return;
    this.connect();
  }

  private tryDisconnect() {
    if (this.handlers.length) return;
    this.disconnect();
  }
}
