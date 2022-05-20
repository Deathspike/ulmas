import * as electron from 'electron';

export class StreamForwarder {
  private readonly sendQueue: Array<string> = [];
  private renderer?: electron.WebContents;
  private sendPromise = Promise.resolve();

  private constructor(
    private readonly stream: NodeJS.WriteStream) {}

  static create(stream: NodeJS.WriteStream) {
    const forwarder = new StreamForwarder(stream);
    forwarder.attach();
    return forwarder;
  }

  attach() {
    const self = this;
    const write = this.stream.write;
    this.stream.write = function() {
      self.send(arguments[0]);
      return write.apply(self.stream, arguments as any);
    };
  }

  register(renderer: electron.WebContents) {
    this.renderer = renderer;
    this.flush();
  }

  unregister() {
    delete this.renderer;
  }

  private flush() {
    while (true) {
      const value = this.sendQueue.shift();
      if (!value) break;
      this.send(value);
    }
  }

  private send(value: string) {
    this.sendPromise = this.sendPromise.then(() => this.renderer
      ? this.renderer.executeJavaScript(`console.log(${JSON.stringify(value.trim())})`)
      : this.sendQueue.push(value));
  }
}
