import * as core from 'client/core';

export class GamepadManager {
  private readonly gamepads: Record<number, core.GamepadObserver> = [];
  private tickInterval?: NodeJS.Timer;

  static createEmulator() {
    const manager = new GamepadManager();
    window.addEventListener('gamepadconnected', x => manager.connect(x.gamepad.index));
    window.addEventListener('gamepaddisconnected', x => manager.disconnect(x.gamepad.index));
  }

  connect(index: number) {
    this.gamepads[index] = new core.GamepadObserver(index);
    this.tickInterval ??= setInterval(() => this.onTick(), 100);
  }

  disconnect(index: number) {
    delete this.gamepads[index];
    if (!Object.keys(this.gamepads).length && this.tickInterval) {
      clearInterval(this.tickInterval);
      delete this.tickInterval;
    }
  }

  private onTick() {
    const activeElement = document.activeElement && document.activeElement !== document.body
      ? document.activeElement
      : document.documentElement;
    for (const gamepad of Object.values(this.gamepads)) {
      const buttons = Array.from(gamepad.buttons());
      const keyNames = buttons.map(translateButton);
      for (const keyName of keyNames) {
        activeElement.dispatchEvent(keyName === 'enter'
          ? new MouseEvent('click', {bubbles: true, cancelable: true})
          : new KeyboardEvent('keydown', {bubbles: true, cancelable: true, code: keyName}));
      }
    }
  }
}

function translateButton(button: number) {
  switch (button) {
    case 0: return 'enter';
    case 1: return 'escape';
    case 12: return 'arrowUp';
    case 13: return 'arrowDown';
    case 14: return 'arrowLeft';
    case 15: return 'arrowRight';
    default: return 'space';
  }
}
