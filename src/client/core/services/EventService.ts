import * as api from '../../../api';

export class EventService {
  private readonly baseUrl = new URL(`ws://${window.location.hostname}:6877/`); // HTTPS
  private readonly handlers: Array<(event: api.models.Event) => void>;
  private socket?: WebSocket;

  constructor() {
    this.handlers = [];
  }

  addEventListener(handler: (event: api.models.Event) => void) {
    this.handlers.push(handler);
    this.tryConnect();
  }

  removeEventListener(handler: (event: api.models.Event) => void) {
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
    const event = new api.models.Event(JSON.parse(message.data));
    this.handlers.forEach(x => x(event));
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
