export class GamepadObserver {
  constructor(
    private readonly index: number,
    private readonly states: Record<number, number> = {}) {}

  *buttons() {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[this.index];
    if (gamepad) {
      const now = Date.now();
      yield *this.checkAxes(gamepad, now);
      yield *this.checkButtons(gamepad, now);
    }
  }

  private *checkAxes(gamepad: Gamepad, now: number) {
    for (let i = 0; i < gamepad.axes.length; i++) {
      const axis = gamepad.axes[i];
      const vertical = i % 2;
      if (Math.abs(axis) >= 0.5) {
        const button = vertical ? (axis < 0 ? 12 : 13) : (axis < 0 ? 14 : 15);
        if (!this.states[button]) yield button;
        this.states[button] = now;
      }
    }
  }

  private *checkButtons(gamepad: Gamepad, now: number) {
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const button = gamepad.buttons[i];
      if (button.pressed) {
        if (this.states[i]) continue;
        this.states[i] = now;
        yield i;
      } else if (this.states[i] < now) {
        this.states[i] = 0;
      }
    }
  }
}
