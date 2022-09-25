export class GamepadObserver {
  constructor(
    private readonly index: number,
    private readonly states = new Map<number, number>()) {}

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
    for (let axisIndex = 0; axisIndex < gamepad.axes.length; axisIndex++) {
      const axis = gamepad.axes[axisIndex];
      const vertical = axisIndex % 2;
      const i = vertical ? (axis < 0 ? 12 : 13) : (axis < 0 ? 14 : 15);
      if (Math.abs(axis) >= 0.5) {
        if (!this.states.has(i)) yield i;
        this.states.set(i, now);
      } else if (this.states.has(i) && Number(this.states.get(i)) < now) {
        this.states.delete(i);
      }
    }
  }

  private *checkButtons(gamepad: Gamepad, now: number) {
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const button = gamepad.buttons[i];
      if (button.pressed) {
        if (!this.states.has(i)) yield i;
        this.states.set(i, now);
      } else if (this.states.has(i) && Number(this.states.get(i)) < now) {
        this.states.delete(i);
      }
    }
  }
}
